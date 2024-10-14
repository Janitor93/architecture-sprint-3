import { kafka } from './client';

async function consume(topic: 'sensor_data', callback: (payload: any) => any) {
  const consumer = kafka.consumer({ groupId: 'telemetry' });
  await consumer.connect();
  console.log('connected');
  await consumer.subscribe({
    topics: [topic],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value.toString();
      callback(value);
    },
  });
}

export { consume };
