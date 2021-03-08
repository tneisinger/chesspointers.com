import bodyParser from 'body-parser';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { Opening } from '../../shared/entity/opening';

export function openingApiRouter(openingRepository: Repository<Opening>): Router {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/openings', async (_req, res) => {
    const openings: Opening[] = await openingRepository.find({
      order: {
        shortName: 'ASC',
      },
    });
    res.json(openings);
  });

  router.get('/api/openings/:openingId', async (req, res) => {
    const openingId = parseInt(req.params.openingId);
    const opening: Opening = await openingRepository.findOne(openingId);
    res.json(opening);
  });

  return router;
}
