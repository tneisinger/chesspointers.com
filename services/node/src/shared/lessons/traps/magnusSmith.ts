import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Qxd8 = {
  move: 'Qxd8',
  teachingPriority: 900,
};

const Qxg4 = {
  move: 'Qxg4',
  teachingPriority: -800,
};

const Bc3 = {
  move: 'Bc3',
  teachingPriority: -900,
};

const branch_dxe5 = makeChessTree(
  // prettier-ignore
  [
             'dxe5',
    'Bxf7+', 'Kxf7',
     Qxd8
  ],
  [],
);

const branch_Ng4 = makeChessTree(
  // prettier-ignore
  [
            'Ng4',
    'e6',   'Bxe6',
    'Bxe6', 'fxe6',
     Qxg4
  ],
  [],
);

const branch_d5 = makeChessTree(
  // prettier-ignore
  [
            'd5',
    'Nxd5', 'cxd5',
    'Bxd5',
  ],
  [],
);

const branch_e6 = makeChessTree(
  // prettier-ignore
  [
           'e6',
    'g4',  'Ng7',
    'Ne4', 'Qa5+',
    'Bd2', 'Qxe5',
     Bc3,
  ],
  [],
);

const branch_Nh5 = makeChessTree(
  // prettier-ignore
  [
           'Nh5',
    'Qf3',
  ],
  [branch_d5, branch_e6],
);

const Nxc6 = { move: 'Nxc6', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'c5',
    'Nf3',  'd6',
    'd4',   'cxd4',
    'Nxd4', 'Nf6',
    'Nc3',  'Nc6',
    'Bc4',  'g6',
     Nxc6,  'bxc6',
    'e5',
  ],
  [branch_dxe5, branch_Ng4, branch_Nh5],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Magnus Smith Trap';
lesson.shortName = 'Magnus Smith';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;

export default lesson;
