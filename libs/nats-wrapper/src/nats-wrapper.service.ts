import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DEFAULT_SUBJECT_PATTERN, NatsSubjects } from '../../../libs/utils';
import { connect, JSONCodec, JetStreamClient, NatsConnection } from 'nats';

@Injectable()
export class NatsWrapperService implements OnModuleInit, OnModuleDestroy {
  private connection: NatsConnection;
  private jetstream: JetStreamClient;
  private jsonCodec = JSONCodec();

  async onModuleInit() {
    this.connection = await connect({ servers: process.env.NATS_URL });
    this.jetstream = this.connection.jetstream();

    const jsm = await this.connection.jetstreamManager();
    await this.setupStream(jsm, NatsSubjects.EVENTS_FACEBOOK);
    await this.setupStream(jsm, NatsSubjects.EVENTS_TIKTOK);

    console.log('NATS connected and ready');
  }

  private async setupStream(jsm: any, name: string) {
    try {
      await jsm.streams.add({
        name,
        subjects: [DEFAULT_SUBJECT_PATTERN],
      });
    } catch (error) {
      if (error.api_error.err_code !== 10065) {
        console.error('Failed to create stream:', name, error);
      }
    }
  }

  async isConnected() {
    return !this.connection.isClosed();
  }

  async publish(subject: string, data: any) {
    this.connection.publish(subject, this.jsonCodec.encode(data));
  }

  async subscribe(subject: string, callback: (data: any) => void) {
    const subscription = this.connection.subscribe(subject);

    (async () => {
      for await (const message of subscription) {
        try {
          callback(this.jsonCodec.decode(message.data));
        } catch (error) {
          console.error('Message processing failed:', error);
        }
      }
    })();
  }

  async onModuleDestroy() {
    if (!this.connection.isClosed()) {
      await this.connection.drain();
      console.log('NATS connection closed');
    }
  }
}
