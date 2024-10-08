import { KafkaOptions, Transport } from '@nestjs/microservices';

export const microserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,

  options: {
    client: {
      brokers: [process.env.KAFKA],
    },
    consumer: {
      groupId: 'devices',
      allowAutoTopicCreation: true,
    },
  },
};
