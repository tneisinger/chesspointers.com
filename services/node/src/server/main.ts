import express from 'express';
import path from 'path';
import { createConnection, Repository } from 'typeorm';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import { chessTrapApiRouter } from './routes/chess-traps-api-router';
import { ChessTrap } from '../shared/entity/chessTrap';
import allTraps from '../shared/chessTraps/index';
import * as config from './config';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`TYPEORM_ENTITIES: ${process.env.TYPEORM_ENTITIES}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);

// Establish a connection to the database
createConnection()
  .then(async (connection) => {
    // Get all the chessTraps that are saved in the db
    const chessTrapsRepository: Repository<ChessTrap> =
      connection.getRepository(ChessTrap);
    const chessTraps: ChessTrap[] = await chessTrapsRepository.find();

    // Insert any chessTraps that are not yet saved in the db
    const namesOfTrapsInDB = chessTraps.map(trap => trap.name);
    allTraps.forEach(trap => {
      if (!namesOfTrapsInDB.includes(trap.name)) {
        chessTrapsRepository.save(trap);
      }
    });

    // Setup the express server
    const app = express();
    app.set('view engine', 'ejs');

    app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
    app.use(chessTrapApiRouter(chessTrapsRepository));
    app.use(staticsRouter());
    app.use(pagesRouter());

    app.listen(config.SERVER_PORT, () => {
      console.log(`App listening on port ${config.SERVER_PORT}!`);
    });
  })
  .catch((error) => console.log(error));
