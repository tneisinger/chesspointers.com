import { ChessTree } from '../../chessTypes';
import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const Nf3_checkmate = {
  move: 'Nf3#',
  teachingPriority: 80,
};

const branch_Rf1: ChessTree = makeChessTree(
  // prettier-ignore
  [ 'Rf1', 'Qxe4+',
    'Be2',  Nf3_checkmate,
  ],
  [],
);

const branch_Nxh8: ChessTree = makeChessTree(
  // prettier-ignore
  [ 'Nxh8', 'Qxh1+',
    'Bf1',  'Qxe4+',
    'Be2',  'Bc5',
    'Nc3',  'Nf3+',
    'Kf1',  'Qh4',
    'Kg2',  'Qxf2+',
    'Kh1',  'Qxh2#',
  ],
  [],
);

const Qxe5 = {
  move: 'Qxe5',
  teachingPriority: 100,
};

const branch_g3: ChessTree = makeChessTree(['g3', Qxe5], []);

const Nxf7 = { move: 'Nxf7', teachingPriority: -100 };

const branch_Bxf7: ChessTree = makeChessTree(
  // prettier-ignore
  [
    'Bxf7+', 'Kd8',
    'Ng4',   'Nh6',
    'h3',     Nxf7,
  ],
  [],
);

const branch_Nxf7: ChessTree = makeChessTree(['Nxf7', 'Qxg2'], [branch_Rf1, branch_Nxh8]);

const branch_Ng4 = makeChessTree(
  // prettier-ignore
  [
    'Ng4',  'd5',
    'Bxd5', 'Bxg4',
  ],
  [],
);

const Qg5 = {
  move: 'Qg5',
  isPreviewPosition: true,
};

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',  'e5',
    'Nf3', 'Nc6',
    'Bc4', 'Nd4',
    'Nxe5', Qg5,
  ],
  [branch_g3, branch_Nxf7, branch_Bxf7, branch_Ng4],
);

const attribution = new Attribution();
attribution.text = 'Based on a YouTube video by thechesswebsite';
attribution.url = 'https://youtu.be/tYOnym3ZINU?t=109';

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Blackburne-Shilling Trap';
lesson.shortName = 'Blackburne-Shilling';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
