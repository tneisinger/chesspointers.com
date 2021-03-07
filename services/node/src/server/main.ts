import express from 'express';
import path from 'path';
import { createConnection, Repository } from 'typeorm';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import { trapApiRouter } from './routes/chess-traps-api-router';
import { Trap } from '../shared/entity/trap';
import allTraps from '../shared/traps/index';
import * as config from './config';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`TYPEORM_ENTITIES: ${process.env.TYPEORM_ENTITIES}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);

// Establish a connection to the database
createConnection()
  .then(async (connection) => {
    // Get all the traps that are saved in the db
    const trapsRepository: Repository<Trap> = connection.getRepository(Trap);
    const traps: Trap[] = await trapsRepository.find();

    // Insert any traps that are not yet saved in the db
    const namesOfTrapsInDB = traps.map((trap) => trap.shortName);
    Object.values(allTraps).forEach((trap) => {
      if (!namesOfTrapsInDB.includes(trap.shortName)) {
        trapsRepository.save(trap);
      }
    });

    // Setup the express server
    const app = express();
    app.set('view engine', 'ejs');

    app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
    app.use(trapApiRouter(trapsRepository));
    app.use(staticsRouter());
    app.use(pagesRouter());

    app.listen(config.SERVER_PORT, () => {
      console.log(`App listening on port ${config.SERVER_PORT}!`);
    });
  })
  .catch((error) => console.log(error));
