import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Qxh7_checkmate = {
  move: 'Qxh7#',
  teachingPriority: 900,
};

const Bxa8 = {
  move: 'Bxa8',
  teachingPriority: 800,
};

const branch_Ne4 = makeChessTree(
  // prettier-ignore
  [
            'Ne4',
    'Bxe4', 'Bxe4',
    'Qxe4', 'Qxg5',
    'Qxa8',
  ],
  [],
);

const branch_Qxg5 = makeChessTree(
  // prettier-ignore
  [
            'Qxg5',
    'Bxb7', 'Nc6',
     Bxa8,
  ],
  [],
);

const branch_Nxe2 = makeChessTree(
  // prettier-ignore
  [
                    'Nxe2',
    Qxh7_checkmate,
  ],
  [],
);

const Ng5 = { move: 'Ng5', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'Nf6',
    'c4',   'e6',
    'Nf3',  'Bb4+',
    'Bd2',  'Bxd2',
    'Qxd2', 'b6',
    'g3',   'Bb7',
    'Bg2',  'O-O',
    'Nc3',  'Ne4',
    'Qc2',  'Nxc3',
     Ng5,
  ],
  [branch_Ne4, branch_Nxe2, branch_Qxg5],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Monticelli Trap';
lesson.shortName = 'Monticelli';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;

export default lesson;
