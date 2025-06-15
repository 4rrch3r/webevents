import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DEFAULT_SUBJECT_PATTERN, NatsSubjects } from '../../../libs/utils';
import { connect, JSONCodec, JetStreamClient, NatsConnection } from 'nats';

@Injectable()
export class NatsWrapperService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private codec = JSONCodec();

  async onModuleInit() {
    this.nc = await connect({ servers: process.env.NATS_URL });
    this.js = this.nc.jetstream();
    const jsm = await this.nc.jetstreamManager();

    try {
      await jsm.streams.add({
        name: NatsSubjects.EVENTS_FACEBOOK,
        subjects: [DEFAULT_SUBJECT_PATTERN],
      });
      await jsm.streams.add({
        name: NatsSubjects.EVENTS_TIKTOK,
        subjects: [DEFAULT_SUBJECT_PATTERN],
      });
      console.log(`[NATS] Stream 'EVENTS' created`);
    } catch {
      console.log(`[NATS] Stream 'EVENTS' error`);
    }
    console.log('[NATS] Connected');
  }

  async isConnected() {
    return !!this.nc.closed;
  }

  async publish(subject: string, payload: any) {
    await this.nc.publish(subject, this.codec.encode(payload));
    console.log(`[NATS] Published to ${subject}`);
  }

  async subscribe(subject: string, handler: (data: any) => void) {
    const sub = this.nc.subscribe(subject);

    console.log(`[NATS] Subscribed to ${subject}`);

    (async () => {
      for await (const msg of sub) {
        const data = this.codec.decode(msg.data);
        try {
          await handler(data);
        } catch (err) {
          console.error('[NATS] Error in handler:', err);
        }
      }
    })();
  }

  async onModuleDestroy() {
    await this.nc.drain();
    console.log('[NATS] Connection closed');
  }
}
