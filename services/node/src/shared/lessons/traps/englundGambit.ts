import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const Qc1_checkmate = {
  move: 'Qc1#',
  teachingPriority: 900,
};

const Qxe5 = {
  move: 'Qxe5',
  teachingPriority: -900,
};

const branch_Qxc3 = makeChessTree(
  // prettier-ignore
  [ 'Qxc3', Qc1_checkmate ],
  [],
);

const branch_Nxc3 = makeChessTree(
  // prettier-ignore
  [ 'Nxc3', 'Qxa1+',
    'Nd1',  'Nxe5',
    'Nxe5',  Qxe5,
  ],
  [],
);

const branch_Bxb4 = makeChessTree(
  // prettier-ignore
  [ 'Bxb4', 'Nxb4',
  ],
  [],
);

const branch_Qd2 = makeChessTree(
  // prettier-ignore
  [ 'Qd2', 'Bxc3' ],
  [branch_Qxc3, branch_Nxc3],
);

const Qb4_check = { move: 'Qb4+', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'e5',
    'dxe5', 'Nc6',
    'Nf3',  'Qe7',
    'Bf4',   Qb4_check,
    'Bd2',  'Qxb2',
    'Bc3',  'Bb4',
  ],
  [branch_Qd2, branch_Bxb4],
);

const attribution = new Attribution();
attribution.text = 'Based on a YouTube video by thechesswebsite';
attribution.url = 'https://youtu.be/tYOnym3ZINU?t=463';

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Englund Gambit Trap';
lesson.shortName = 'Englund Gambit';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;

lesson.attribution = attribution;

export default lesson;
