import bodyParser from 'body-parser';
import { Repository } from 'typeorm';
import { Router } from 'express';

type Options = {
  typeormFindAllArg: Record<string, unknown>;
};

export function makeApiResourceRouter<T>(
  repository: Repository<T>,
  resourceName: string,
  options?: Options,
): Router {
  const router = Router();
  router.use(bodyParser.json());

  router.get(`/api/${resourceName}`, async (_req, res) => {
    let findAllArg = {};
    if (options && options.typeormFindAllArg) {
      findAllArg = options.typeormFindAllArg;
    }

    const resources: T[] = await repository.find(findAllArg);
    res.json(resources);
  });

  router.get(`/api/${resourceName}/:resourceId`, async (req, res) => {
    const resourceId = parseInt(req.params.resourceId);
    const resource: T = await repository.findOne(resourceId);
    res.json(resource);
  });

  return router;
}
