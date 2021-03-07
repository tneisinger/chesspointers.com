import bodyParser from 'body-parser';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { Trap } from '../../shared/entity/chessTrap';

export function chessTrapApiRouter(chessTrapRepository: Repository<Trap>): Router {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/traps', async (_req, res) => {
    const traps: Trap[] = await chessTrapRepository.find({
      order: {
        shortName: 'ASC',
      },
    });
    res.json(traps);
  });

  router.get('/api/traps/:trapId', async (req, res) => {
    const trapId = parseInt(req.params.trapId);
    const trap: Trap = await chessTrapRepository.findOne(trapId);
    res.json(trap);
  });

  return router;
}
