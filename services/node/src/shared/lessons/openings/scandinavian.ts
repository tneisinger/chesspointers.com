import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const mv8_w_Nd5 = makeChessTree(
  // prettier-ignore
  [ 'Nd5',   'Qd8',
    'Nxf6',  'gxf6',
    'Bb3',   'Nd7',
    'Qe2',   'Qc7',
    'Nh4',   'Bg6',
    'O-O-O', 'O-O-O',
  ],
  [],
);

const mv8_w_Ne4 = makeChessTree(
  // prettier-ignore
  [ 'Ne4',   'Qd8',
    'Ng3',   'Bg4',
    'c3',    'Nbd7',
    'h3',    'Bxf3',
    'Qxf3',  'Bd6',
    'O-O',   'O-O',
    'Rad1',
  ],
  [],
);

const mv8_w_Qe2 = makeChessTree(
  // prettier-ignore
  [ 'Qe2',   'Bb4',
    'O-O-O', 'Nbd7',
    'a3',    'Bxc3',
    'Bxc3',  'Qc7',
    'Ne5',   'Nxe5',
    'dxe5',  'Nd5',
    'Bd2',   'O-O-O',
    'g4',    'Bg6',
    'f4',    'h5',
    'h3',    'Qb6',
    'Rhf1',  'hxg4',
    'hxg4',  'Qc5',
    'Bb3',   'Rh3',
    'Rf3',   'Rdh8',
    'Rdf1',  'Rh2',
    'Qe1',
  ],
  [],
);

const mv4_w_b4 = makeChessTree(
  // prettier-ignore
  [ 'b4',   'Qxb4',
    'Rb1', 'Qd6',
    'd4', 'Nf6',
  ],
  [],
);

const mv5_b_c6 = makeChessTree(
  // prettier-ignore
  [         'c6',
    'Bc4',  'Bf5',
    'Bd2',  'e6',

  ],
  [mv8_w_Nd5, mv8_w_Ne4, mv8_w_Qe2],
);

const mv6_b_Nc6 = makeChessTree(
  // prettier-ignore
  [        'Nc6',
    'd5',  'O-O-O',
  ],
  [],
);

const mv6_b_e6 = makeChessTree(
  // prettier-ignore
  [        'e6',
    'O-O', 'Be7',
    'Bd2', 'c6',
    'Re1', 'O-O',
  ],
  [],
);

const mv5_b_Bg4 = makeChessTree(
  // prettier-ignore
  [        'Bg4',
    'Be2',
  ],
  [mv6_b_Nc6, mv6_b_e6],
);

const mv4_w_d4 = makeChessTree(
  // prettier-ignore
  [ 'd4',   'Nf6',
    'Nf3',
  ],
  [mv5_b_c6, mv5_b_Bg4],
);

const mv3_b_Qa5 = makeChessTree(
  // prettier-ignore
  [         'Qa5',
  ],
  [mv4_w_d4, mv4_w_b4],
);

const mv6_w_g3 = makeChessTree(
  // prettier-ignore
  [ 'g3',   'Bg4',
    'Bf4',  'Qb6',
  ],
  [],
);

const mv6_w_Bd3 = makeChessTree(
  // prettier-ignore
  [ 'Bd3', 'Be6',
    'O-O', 'Nc6',
    'h3',  'O-O-O',
  ],
  [],
);

const mv3_b_Qd6 = makeChessTree(
  // prettier-ignore
  [         'Qd6',
    'd4',   'Nf6',
    'Nf3',  'a6',
  ],
  [mv6_w_g3, mv6_w_Bd3],
);

const mv3_w_Nc3 = makeChessTree(
  // prettier-ignore
  [ 'Nc3',
  ],
  [mv3_b_Qa5, mv3_b_Qd6],
);

const mv3_w_Nf3 = makeChessTree(
  // prettier-ignore
  [ 'Nf3',  'Bg4',
    'Be2',  'Nc6',
    'O-O', 'O-O-O',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'd5',
    'exd5', 'Qxd5',
  ],
  [mv3_w_Nc3, mv3_w_Nf3],
);

const attribution = new Attribution();
attribution.text = 'Based on vidoes by Hanging Pawns and GothamChess';
attribution.url =
  'https://www.youtube.com/watch?v=Wpd8jcVKcJw&list=TLGG2sqnnzMuoAswMzA0MjAyMQ';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'The Scandinavian Defense';
lesson.shortName = 'Scandinavian';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
