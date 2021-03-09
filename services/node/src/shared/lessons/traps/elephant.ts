import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Nbd7 = { move: 'Nbd7', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'd5',
    'c4',   'e6',
    'Nc3',  'Nf6',
    'Bg5',   Nbd7,
    'cxd5', 'exd5',
    'Nxd5', 'Nxd5',
    'Bxd8', 'Bb4+',
    'Qd2',  'Bxd2+',
    'Kxd2', 'Kxd8',
  ],
  [],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Elephant Trap';
lesson.shortName = 'Elephant';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;

export default lesson;
