import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Ng4 = { move: 'Ng4', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
    'Nf3',  'Nc6',
    'Bb5',  'Nf6',
    'O-O',   Ng4,
    'h3',   'h5',
    'hxg4', 'hxg4',
    'Ne1',  'Qh4',
    'f3',   'g3',
    'Rf2',  'Qh1#',
  ],
  [],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Fishing Pole Trap';
lesson.shortName = 'Fishing Pole';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;

export default lesson;
