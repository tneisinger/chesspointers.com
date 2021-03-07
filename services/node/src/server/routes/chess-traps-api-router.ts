import bodyParser from 'body-parser';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { Trap } from '../../shared/entity/trap';

export function trapApiRouter(trapRepository: Repository<Trap>): Router {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/traps', async (_req, res) => {
    const traps: Trap[] = await trapRepository.find({
      order: {
        shortName: 'ASC',
      },
    });
    res.json(traps);
  });

  router.get('/api/traps/:trapId', async (req, res) => {
    const trapId = parseInt(req.params.trapId);
    const trap: Trap = await trapRepository.findOne(trapId);
    res.json(trap);
  });

  return router;
}
