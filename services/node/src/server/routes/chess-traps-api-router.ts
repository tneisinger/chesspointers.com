import bodyParser from 'body-parser';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { ChessTrap } from '../../shared/entity/chessTrap';

export function chessTrapApiRouter(chessTrapRepository: Repository<ChessTrap>): Router {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/traps', async (_req, res) => {
    const traps: ChessTrap[] = await chessTrapRepository.find({
      order: {
        name: 'ASC',
      },
    });
    res.json(traps);
  });

  router.get('/api/traps/:trapId', async (req, res) => {
    const trapId = parseInt(req.params.trapId);
    const trap: ChessTrap = await chessTrapRepository.findOne(trapId);
    res.json(trap);
  });

  return router;
}
