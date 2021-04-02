import { Lesson, LessonType } from '../../entity/lesson';
import { Attribution } from '../../entity/attribution';
import { makeChessTree } from '../../chessTree';

const mv7_b_Bg4 = makeChessTree(
  // prettier-ignore
  [          'Bg4',
    'Qb3',   'Bxf3',
    'Bxf7+', 'Kd7',
    'Qxb7+'
  ],
  [],
);

const mv7_b_e5 = makeChessTree(
  // prettier-ignore
  [          'e5',
    'Ng5',
  ],
  [],
);

const mv7_b_e6 = makeChessTree(
  // prettier-ignore
  [          'e6',
    'Nc2',   'Be7',
    'd4',    'cxd4',
    'Ncxd4',
  ],
  [],
);

const mv4_b_Nf6 = makeChessTree(
  // prettier-ignore
  [          'Nf6',
    'Na3',   'Nc6',
    'Bc4',   'Qd8',
    'O-O',
  ],
  [mv7_b_Bg4, mv7_b_e5, mv7_b_e6],
);

const mv4_b_Bg4 = makeChessTree(
  // prettier-ignore
  [        'Bg4',
    'Be2', 'Nf6',
    'Na3',  'Nc6',
    'O-O', 'e6',
    'd4',  'cxd4',
    'Nb5', 'Qd7',
    'Nfxd4', 'Bxe2',
    'Qxe2', 'Nxd4',
    'Nxd4', 'Be7',
    'Bf4', 'O-O',
    'Rfd1',
  ],
  [],
);

const mv2_b_d5 = makeChessTree(
  // prettier-ignore
  [          'd5',
    'exd5',  'Qxd5',
    'Nf3',
  ],
  [mv4_b_Nf6, mv4_b_Bg4],
);

const mv2_b_d6 = makeChessTree(
  // prettier-ignore
  [         'd6',
    'd4',   'cxd4',
    'cxd4', 'Nf6',
    'Nc3',  'g6',
    'f4',
  ],
  [],
);

const mv10_b_Qxd1 = makeChessTree(
  // prettier-ignore
  [         'Qxd1',
    'Bxf7+', 'Kd8',
    'Rxd1+',
  ],
  [],
);

const mv10_b_e6 = makeChessTree(
  // prettier-ignore
  [         'e6',
    'Qh5',  'g6',
    'Qf3',
  ],
  [],
);

const mv9_b_dxc3 = makeChessTree(
  // prettier-ignore
  [         'dxc3',
    'Ng5',
  ],
  [mv10_b_Qxd1, mv10_b_e6],
);

const mv9_b_Be6 = makeChessTree(
  // prettier-ignore
  [         'Be6',
    'Na3',  'dxc3',
    'Qe2',  'Bxb3',
    'Nb5',  'Qb8',
    'axb3', 'e6',
    'g3',   'Qc8',
    'Ng5',
  ],
  [],
);

const mv5_b_Nc6 = makeChessTree(
  // prettier-ignore
  [         'Nc6',
    'Bc4',  'Nb6',
    'Bb3',  'd5',
    'exd6',  'Qxd6',
    'O-O',
  ],
  [mv9_b_Be6, mv9_b_dxc3],
);

const mv5_b_d6 = makeChessTree(
  // prettier-ignore
  [         'd6',
    'Bc4',  'e6',
    'cxd4', 'Nc6',
    'O-O',  'Be7',
    'Qe2',  'O-O',
    'Rd1',  'dxe5',
    'dxe5', 'Qc7',
    'Bd2',  'Rd8',
    'Nc3',
  ],
  [],
);

const mv2_b_Nf6 = makeChessTree(
  // prettier-ignore
  [         'Nf6',
    'e5',   'Nd5',
    'd4',   'cxd4',
    'Nf3',
  ],
  [mv5_b_d6, mv5_b_Nc6],
);

const mv2_b_Nc6 = makeChessTree(
  // prettier-ignore
  [         'Nc6',
    'd4',   'cxd4',
    'cxd4', 'g6',
    'd5',   'Ne5',
    'f4',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'c5',
    'c3',
  ],
  [mv2_b_Nf6, mv2_b_d5, mv2_b_Nc6, mv2_b_d6],
);

const attribution = new Attribution();
attribution.text = 'Based on a YouTube video by GothamChess';
attribution.url = 'https://www.youtube.com/watch?v=VxV8l3x7hOg';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'Sicilian: Alapin Variation';
lesson.shortName = 'Sicilian Alapin';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
