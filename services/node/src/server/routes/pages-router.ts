import { Router } from 'express';
import { getManifest } from './manifest-manager';
import metadata from '../../shared/metadata.json';

export function pagesRouter(): Router {
  const router = Router();

  router.get(`/**`, async (_, res) => {
    const manifest = await getManifest();
    res.render('page.ejs', { manifest, metadata });
  });

  return router;
}
