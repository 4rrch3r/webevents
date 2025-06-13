import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  connect,
  JSONCodec,
  JetStreamClient,
  NatsConnection,
  AckPolicy,
} from 'nats';

@Injectable()
export class NatsWrapperService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private codec = JSONCodec();

  async onModuleInit() {
    this.nc = await connect({ servers: 'nats://nats:4222' });
    this.js = this.nc.jetstream();
    const jsm = await this.nc.jetstreamManager();

    try {
      await jsm.streams.add({
        name: 'events_facebook',
        subjects: ['events_*'],
      });
      await jsm.streams.add({
        name: 'events_tiktok',
        subjects: ['events_*'],
      });
      console.log(`[NATS] Stream 'EVENTS' created`);
    } catch {
      console.log(`[NATS] Stream 'EVENTS' error`);
    }
    // try {
    //   await jsm.streams.info('events_facebook');
    //   // await jsm.streams.info('events_tiktok');
    // } catch {
    //   await jsm.streams.add({
    //     name: 'events_facebook',
    //     subjects: ['events_*'],
    //   });
    //   await jsm.streams.add({
    //     name: 'events_tiktok',
    //     subjects: ['events_*'],
    //   });
    //   console.log(`[NATS] Stream 'EVENTS' created`);
    // }

    console.log('[NATS] Connected');
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
