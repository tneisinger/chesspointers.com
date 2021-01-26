import { User } from '../shared/entity/user';

const joanna = new User();
joanna.firstName = 'Joanna';
joanna.lastName = 'Newsom';
joanna.age = 38;
joanna.email = 'monkey@bear.com';

const borges = new User();
borges.firstName = 'Jorge';
borges.lastName = 'Borges';
borges.age = 121;
borges.email = 'only@thezahir.com';

const pinker = new User();
pinker.firstName = 'Steven';
pinker.lastName = 'Pinker';
pinker.age = 66;
pinker.email = 'theblank@slate.com';

export const defaultUsers: User[] = [joanna, borges, pinker];
