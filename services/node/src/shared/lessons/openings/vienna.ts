import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Nc3 = { move: 'Nc3', isPreviewPosition: true };

const mv6_b_Ng4 = makeChessTree(
  // prettier-ignore
  [         'Ng4',
    'Ng5',  'Nf2',
    'Qh5',  'g6',
    'Bxf7+'
  ],
  [],
);

const mv6_b_Bg4 = makeChessTree(
  // prettier-ignore
  [         'Bg4',
    'Na4',  'Nd4',
    'Nxc5', 'dxc5',
    'c3',   'Nxf3',
    'gxf3',
  ],
  [],
);

const mv6_w_d4 = makeChessTree(
  // prettier-ignore
  [ 'd4',    'dxe5',
    'Qe2',   'Bb4',
    'Qxe5+', 'Qe7',
    'Bxf4',
  ],
  [],
);

const mv6_w_Qe2 = makeChessTree(
  // prettier-ignore
  [ 'Qe2', 'dxe5',
    'Qxe5+',
  ],
  [],
);

const mv6_w_bxc3 = makeChessTree(
  // prettier-ignore
  [ 'bxc3', 'Be7',
    'd4',  'O-O',
    'Bd3', 'Be6',
    'Ne2', 'c5',
    'O-O', 'Nc6',
    'Be3',
  ],
  [],
);

const mv6_w_dxc3 = makeChessTree(
  // prettier-ignore
  [ 'dxc3',  'Be6',
    'Bf4',   'c5',
    'O-O-O', 'Nc6',
    'Bc4',
  ],
  [],
);

const mv5_b_Nxc3 = makeChessTree(
  // prettier-ignore
  [         'Nxc3',
  ],
  [mv6_w_bxc3, mv6_w_dxc3],
);

const mv5_b_f5 = makeChessTree(
  // prettier-ignore
  [         'f5',
    'd3',   'Nxc3',
    'bxc3', 'd4',
    'Qf2',  'dxc3',
    'd4',
  ],
  [],
);

const mv5_b_Nc6 = makeChessTree(
  // prettier-ignore
  [          'Nc6',
    'Bb5',   'Nxc3',
    'dxc3',  'Qh4+',
    'g3',    'Qe4+',
    'Be3',   'Qxc2',
    'Ne2',   'Qxb2',
    'O-O',   'Qxb5',
    'Qxf7+', 'Kd8',
    'Nd4',   'Nxd4',
    'Bg5+',  'Be7',
    'Qxe7#'
  ],
  [],
);

const mv3_b_Nc6 = makeChessTree(
  // prettier-ignore
  [
            'Nc6',
    'fxe5', 'Nxe5',
    'd4',   'Ng6',
    'e5',   'Ng8',
    'Nf3',
  ],
  [],
);

const mv3_b_exf4 = makeChessTree(
  // prettier-ignore
  [        'exf4',
    'e5',  'Ng8',
    'Nf3', 'd6',
  ],
  [mv6_w_d4, mv6_w_Qe2],
);

const mv3_b_d6 = makeChessTree(
  // prettier-ignore
  [        'd6',
    'Nf3', 'Nc6',
    'Bb5', 'Bd7',
    'd3',
  ],
  [],
);

const mv3_b_d5 = makeChessTree(
  // prettier-ignore
  [         'd5',
    'fxe5', 'Nxe4',
    'Qf3',
  ],
  [mv5_b_Nxc3, mv5_b_f5, mv5_b_Nc6],
);

const mv3_b_Bc5 = makeChessTree(
  // prettier-ignore
  [        'Bc5',
    'Qg4', 'Qf6',
    'Nd5', 'Qxf2+',
    'Kd1', 'g6',
    'Nh3', 'Qd4',
    'd3',
  ],
  [],
);

const mv3_b_Nf6 = makeChessTree(
  // prettier-ignore
  [         'Nf6',
    'd3',   'Bc5',
    'f4',   'd6',
    'Nf3',
  ],
  [mv6_b_Ng4, mv6_b_Bg4],
);

const mv3_w_f4 = makeChessTree(
  // prettier-ignore
  ['f4'],
  [mv3_b_exf4, mv3_b_Nc6, mv3_b_d6, mv3_b_d5],
);

const mv2_b_Nc6 = makeChessTree(
  // prettier-ignore
  [        'Nc6',
    'Bc4',
  ],
  [mv3_b_Bc5, mv3_b_Nf6],
);

const mv2_b_Nf6 = makeChessTree(
  // prettier-ignore
  [         'Nf6',
  ],
  [mv3_w_f4],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
     Nc3,
  ],
  [mv2_b_Nf6, mv2_b_Nc6],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'The Vienna Game';
lesson.shortName = 'Vienna';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;

export default lesson;
