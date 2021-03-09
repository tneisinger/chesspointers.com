import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Nd6_checkmate = { move: 'Nd6#', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [
    'e4',           'c6',
    'd4',           'd5',
    'Nc3',          'dxe4',
    'Nxe4',         'Nd7',
    'Qe2',          'Ngf6',
     Nd6_checkmate,
  ],
  [],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Karpov Smothering Trap';
lesson.shortName = 'Karpov Smothering';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;

export default lesson;
