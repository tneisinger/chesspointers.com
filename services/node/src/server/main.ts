import express from 'express';
import path from 'path';
import { createConnection, Repository } from 'typeorm';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import { makeLessonsApiRouter } from './routes/lessons-api-router';
import { Lesson } from '../shared/entity/lesson';
import allLessons from '../shared/lessons';
import * as config from './config';
import { validateChessTree } from '../shared/chessTree';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`TYPEORM_ENTITIES: ${process.env.TYPEORM_ENTITIES}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);

// Establish a connection to the database
createConnection()
  .then(async (connection) => {
    // Get all the chess lessons that are saved in the db
    const lessonsRepository: Repository<Lesson> = connection.getRepository(Lesson);
    const lessons: Lesson[] = await lessonsRepository.find();

    // Insert any lessons that are not yet in the db
    const namesOfLessonsInDB = lessons.map((lesson) => lesson.shortName);
    Object.values(allLessons).forEach((lesson) => {
      if (!namesOfLessonsInDB.includes(lesson.shortName)) {
        // If a lesson is not in the db, check if it has a valid ChessTree.
        // If the ChessTree is valid, insert the lesson into the db.
        validateChessTree(lesson.chessTree);
        lessonsRepository.save(lesson);
      }
    });

    // Setup the express server
    const app = express();
    app.set('view engine', 'ejs');
    app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

    app.use(makeLessonsApiRouter(lessonsRepository));
    app.use(staticsRouter());
    app.use(pagesRouter());

    app.listen(config.SERVER_PORT, () => {
      console.log(`App listening on port ${config.SERVER_PORT}!`);
    });
  })
  .catch((error) => console.log(error));
