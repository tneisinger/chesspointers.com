import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const mv4_w_c4 = makeChessTree(
  // prettier-ignore
  [ 'c4', 'Nf6',
    'Nf3', 'e6',
    'Nc3', 'Be7',
    'Be2', 'O-O',
    'O-O', 'b6',
    'Bf4', 'Bb7',
  ],
  [],
);

const mv4_w_Nf3_a = makeChessTree(
  // prettier-ignore
  [ 'Nf3', 'Nc6',
    'Nc3', 'Nf6',
    'Be2', 'Bf5',
    'O-O', 'e6',
    'Bf4', 'Be7',
    'Re1', 'O-O',
  ],
  [],
);

const mv4_w_Nf3_b = makeChessTree(
  // prettier-ignore
  [
    'Nf3',  'Nc6',
    'c3',   'Bg4',
    'Be2',  'Bxf3',
    'Bxf3', 'cxd4',
    'cxd4', 'e6',
  ],
  [],
);

const mv4_w_dxc5 = makeChessTree(
  // prettier-ignore
  [ 'dxc5', 'Nc6',
  ],
  [],
);

const mv3_b_c5 = makeChessTree(
  // prettier-ignore
  [         'c5',
  ],
  [mv4_w_Nf3_b, mv4_w_dxc5],
);

const mv3_b_Bf5 = makeChessTree(
  // prettier-ignore
  [         'Bf5',
    'h4',   'h5',
  ],
  [],
);

const mv3_w_e5 = makeChessTree(
  // prettier-ignore
  [ 'e5',
  ],
  [mv3_b_c5, mv3_b_Bf5],
);

const mv3_w_exd5 = makeChessTree(
  // prettier-ignore
  [ 'exd5', 'cxd5',
  ],
  [mv4_w_Nf3_a, mv4_w_c4],
);

const mv4_b_Nf6 = makeChessTree(
  // prettier-ignore
  [          'Nf6',
    'Nxf6+', 'exf6',
    'Nf3',   'Bd6',
    'Bc4',   'O-O',
  ],
  [],
);

const mv4_b_Bf5 = makeChessTree(
  // prettier-ignore
  [        'Bf5',
    'Ng3', 'Bg6',
    'h4',  'h6',
  ],
  [],
);

const mv4_w_Nxe4 = makeChessTree(
  // prettier-ignore
  [ 'Nxe4',
  ],
  [mv4_b_Nf6, mv4_b_Bf5],
);

const mv4_w_f3 = makeChessTree(
  // prettier-ignore
  [ 'f3',   'e3',
    'Bxe3', 'Nf6',
  ],
  [],
);

const mv3_w_Nc3 = makeChessTree(
  // prettier-ignore
  [ 'Nc3', 'dxe4',
  ],
  [mv4_w_Nxe4, mv4_w_f3],
);

const mv3_b_g6 = makeChessTree(
  // prettier-ignore
  [       'g6',
    'Be3', 'Bg7',
  ],
  [],
);

const mv3_b_dxe4 = makeChessTree(
  // prettier-ignore
  [         'dxe4',
    'fxe4', 'e5',
    'dxe5', 'Qh4+',
  ],
  [],
);

const mv3_b_e6 = makeChessTree(
  // prettier-ignore
  [         'e6',
  ],
  [],
);

// Fantasy Variation
const mv3_w_f3 = makeChessTree(
  // prettier-ignore
  [ 'f3' ],
  [mv3_b_g6, mv3_b_dxe4, mv3_b_e6],
);

const mv2_w_d4 = makeChessTree(
  // prettier-ignore
  [ 'd4', 'd5'
  ],
  [mv3_w_e5, mv3_w_exd5, mv3_w_Nc3, mv3_w_f3],
);

const mv2_w_Nc3 = makeChessTree(
  // prettier-ignore
  [ 'Nc3',  'd5',
    'exd5', 'cxd5',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'c6', ],
  [mv2_w_d4, mv2_w_Nc3],
);

const attribution = new Attribution();
attribution.text = 'Based on a YouTube video by GothamChess';
attribution.url = 'https://www.youtube.com/watch?v=rmbU97iftC8';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'The Caro-Kann Defense';
lesson.shortName = 'Caro-Kann';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
