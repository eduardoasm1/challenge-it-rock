import { User } from '../user/entity/user.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}
