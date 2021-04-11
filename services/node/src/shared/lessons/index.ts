import allTraps from './traps';
import allOpenings from './openings';
import { Lesson } from '../entity/lesson';
import { toDashedLowercase } from '../utils';

const allLessons: { [shortName: string]: Lesson } = {
  ...allTraps,
  ...allOpenings,
};

// Get the url path for the provided lesson. For example, if the lesson is the
// elephant trap, return '/traps/elephant'. If the lesson is the Vienna opening, return
// '/openings/vienna'.
export const getLessonUrlPath = (lesson: Lesson): string => (
  `/${lesson.lessonType}s/${toDashedLowercase(lesson.shortName)}`
);

export default allLessons;
