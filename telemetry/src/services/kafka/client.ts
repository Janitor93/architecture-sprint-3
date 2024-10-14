import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'telemetry',
  brokers: [process.env.KAFKA],
  connectionTimeout: 5_000,
  retry: {
    initialRetryTime: 100,
    maxRetryTime: 500,
  },
});

export { kafka };
