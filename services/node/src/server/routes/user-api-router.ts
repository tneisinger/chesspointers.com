import bodyParser from 'body-parser';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../shared/entity/user';

export function userApiRouter(userRepository: Repository<User>) {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/users', async (_req, res) => {
    const users: User[] = await userRepository.find();
    res.json(users);
  });

  router.get('/api/users/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const user: User = await userRepository.findOne(userId);
    res.json(user);
  });

  return router;
}
