import { kafka } from './client';

async function admin() {
  const admin = kafka.admin();
  console.log('Admin connecting...');
  await admin.connect();
  console.log('Admin Connection Success...!!');

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const result = await admin.createTopics({
    topics: [
      {
        topic: 'sensor_data',
        numPartitions: 2,
      },
    ],
  });
  console.log('result', result);

  console.log('Disconnecting Admin..');
  await admin.disconnect();
}

export { admin };
