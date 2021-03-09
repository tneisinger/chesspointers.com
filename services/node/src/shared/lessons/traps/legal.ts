import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Nxe5 = { move: 'Nxe5', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4', 'e5',
    'Nf3', 'Nc6',
    'Bc4', 'd6',
    'Nc3', 'Bg4',
    'h3', 'Bh5',
     Nxe5, 'Bxd1',
    'Bxf7+', 'Ke7',
    'Nd5#'
  ],
  [],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Legal Trap';
lesson.shortName = 'Legal';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;

export default lesson;
