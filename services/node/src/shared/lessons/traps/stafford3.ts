import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Bxf2 = {
  move: 'Bxf2+',
  teachingPriority: -800,
};

const Qh4 = {
  move: 'Qh4',
  teachingPriority: -900,
};

const branch_Kh1 = makeChessTree(
  // prettier-ignore
  [
    'Kh1',  'Nf2+',
    'Kg1',   'Qh1#',
  ],
  [],
);

const branch_Kh2 = makeChessTree(
  // prettier-ignore
  [
    'Kh2',  'Nf2+',
    'Kg1',  'Qh1#',
  ],
  [],
);

const branch_Qf3_a = makeChessTree(
  // prettier-ignore
  [
    'Qf3', 'Ne5',
    'Qe2',  Qh4,
  ],
  [],
);

const branch_Rxf2 = makeChessTree(
  // prettier-ignore
  [
    'Rxf2', Bxf2,
  ],
  [],
);

const branch_Qf3_b = makeChessTree(
  // prettier-ignore
  [
    'Qf3', 'Nxh3+',
  ],
  [branch_Kh1, branch_Kh2],
);

const branch_OO = makeChessTree(
  // prettier-ignore
  [
    'O-O',  'Qh4',
    'h3',   'Nxf2',
  ],
  [branch_Rxf2, branch_Qf3_b],
);

const Nc3 = { move: 'Nc3', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [
    'e4',   'e5',
    'Nf3',  'Nf6',
    'Nxe5', 'Nc6',
    'Nxc6', 'dxc6',
     Nc3,   'Bc5',
    'Bc4',  'Ng4',
  ],
  [branch_OO, branch_Qf3_a],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'Stafford Trap #3';
lesson.shortName = 'Stafford 3';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;

export default lesson;
