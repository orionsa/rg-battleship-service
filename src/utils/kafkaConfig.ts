import { Transport, ClientOptions } from '@nestjs/microservices';

export const kafkaConfig: ClientOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'retro-games',
      brokers: ['localhost:29092'],
    },
    consumer: {
      groupId: 'retro-games-consumer',
    },
  },
};
