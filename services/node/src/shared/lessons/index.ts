import allTraps from './traps';
import allOpenings from './openings';
import { Lesson } from '../entity/lesson';

const allLessons: { [shortName: string]: Lesson } = {
  ...allTraps,
  ...allOpenings,
};

export default allLessons;
