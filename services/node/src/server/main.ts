import express from 'express';
import path from 'path';
import { createConnection, Repository } from 'typeorm';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import { userApiRouter } from './routes/user-api-router';
import { User } from '../shared/entity/user';
import { defaultUsers } from './defaultUsers';
import * as config from './config';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`TYPEORM_ENTITIES: ${process.env.TYPEORM_ENTITIES}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);

// Establish a connection to the database
createConnection()
  .then(async (connection) => {
    // Get all the users from the db
    const userRepository: Repository<User> = connection.getRepository(User);
    const users: User[] = await userRepository.find();

    // Insert the defaultUsers if they aren't already in the db
    const emails = users.map((user) => user.email);
    defaultUsers.forEach((user) => {
      if (!emails.includes(user.email)) {
        userRepository.save(user);
      }
    });

    // Setup the express server
    const app = express();
    app.set('view engine', 'ejs');

    app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
    app.use(userApiRouter(userRepository));
    app.use(staticsRouter());
    app.use(pagesRouter());

    app.listen(config.SERVER_PORT, () => {
      console.log(`App listening on port ${config.SERVER_PORT}!`);
    });
  })
  .catch((error) => console.log(error));
