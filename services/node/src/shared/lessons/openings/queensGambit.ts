import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const mv5_b_h6 = makeChessTree(
  // prettier-ignore
  [         'h6',
    'Bxf6', 'Bxf6',
    'e3',
  ],
  [],
);

const mv5_b_OO = makeChessTree(
  // prettier-ignore
  [         'O-O',
    'Qc2',  'h6',
    'h4',   'hxg5',
    'hxg5', 'Ne4',
    'Nxe4', 'dxe4',
    'Qxe4',
  ],
  [],
);

const mv5_w_Bg5 = makeChessTree(
  // prettier-ignore
  [ 'Bg5' ],
  [mv5_b_OO, mv5_b_h6],
);

const gambitDeclined = makeChessTree(
  // prettier-ignore
  [         'e6',
    'Nf3',  'Nf6',
    'Nc3', 'Be7',
  ],
  [mv5_w_Bg5],
);

const mv4_b_c6 = makeChessTree(
  // prettier-ignore
  [         'c6',
    'axb5', 'cxb5',
    'Nc3',  'a6',
    'Nxb5',
  ],
  [],
);

const mv4_b_a6 = makeChessTree(
  // prettier-ignore
  [         'a6',
    'axb5',
  ],
  [],
);

const mv3_b_b5 = makeChessTree(
  // prettier-ignore
  [         'b5',
    'a4',
  ],
  [mv4_b_a6, mv4_b_c6],
);

const gambitAccepted = makeChessTree(
  // prettier-ignore
  [         'dxc4',
    'e4',
  ],
  [mv3_b_b5],
);

const slav_mv5_w_Qb3 = makeChessTree(
  // prettier-ignore
  [ 'Qb3',
  ],
  [],
)

const slav_mv5_w_Bg5 = makeChessTree(
  // prettier-ignore
  [ 'Bg5',
  ],
  [],
)

const slavDefense = makeChessTree(
  // prettier-ignore
  [         'c6',
    'Nf3', 'Nf6',
    'Nc3', 'Bf5',
  ],
  [slav_mv5_w_Qb3, slav_mv5_w_Bg5],
);

const mv3_b_Nxd5 = makeChessTree(
  // prettier-ignore
  [         'Nxd5',
    'e4',
  ],
  [],
);

const mv3_b_Qxd5 = makeChessTree(
  // prettier-ignore
  [         'Qxd5',
    'Nc3',
  ],
  [],
)

const mv2_b_Nf6 = makeChessTree(
  // prettier-ignore
  [         'Nf6',
    'cxd5',
  ],
  [mv3_b_Nxd5, mv3_b_Qxd5],
);

const balticDefense = makeChessTree(
  // prettier-ignore
  [         'Bf5',
    'Nc3',  'Nf6',
    'Nf3',  'Nc6',
    'Bg5',  'Nb4',
    'Rc1',
  ],
  [],
);

const albinCounterGambit = makeChessTree(
  // prettier-ignore
  [         'e5',
    'dxe5',  'd4',
    'Nf3',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'd5',
    'c4',
  ],
  [
    gambitAccepted,
    gambitDeclined,
    slavDefense,
    mv2_b_Nf6,
    balticDefense,
    albinCounterGambit
  ],
);

const attribution = new Attribution();
attribution.text = 'Based on a Youtube video by GothamChess';
attribution.url = 'https://www.youtube.com/watch?v=mtsabsZ4wG4';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = "Queen's Gambit";
lesson.shortName = "Queen's Gambit";
lesson.playedByWhite = true;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
