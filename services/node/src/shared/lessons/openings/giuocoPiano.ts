import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

// https://www.youtube.com/watch?v=BPpSz2rbG3A

const mv11_b_Nc6 = makeChessTree(
  // prettier-ignore
  [        'Nc6',
    'Qb3',
  ],
  [],
);

const mv11_b_c6 = makeChessTree(
  // prettier-ignore
  [         'c6',
    'Bxd5', 'Qxd5',
    'O-O',  'O-O',
    'Rfe1', 'b6',
    'Re5',  'Qd6',
    'Rae1',
  ],
  [],
);

const mv10_b_Na5 = makeChessTree(
  // prettier-ignore
  [         'Na5',
    'Qa4+',
  ],
  [mv11_b_Nc6, mv11_b_c6],
);

const mv10_b_Nce7 = makeChessTree(
  // prettier-ignore
  [         'Nce7',
    'O-O',  'c6',
    'Rfe1', 'O-O',
    'Ne4',
  ],
  [],
);

const mv7_b_Bxd2Check = makeChessTree(
  // prettier-ignore
  [          'Bxd2+',
    'Nbxd2', 'd5',
    'exd5',  'Nxd5',
    'Qb3',
  ],
  [mv10_b_Nce7, mv10_b_Na5],
);

const mv7_b_Nxe4 = makeChessTree(
  // prettier-ignore
  [          'Nxe4',
    'Bxb4',  'Nxb4',
    'Bxf7+', 'Kxf7',
    'Qb3+',  'd5',
    'Qxb4',
  ],
  [],
);

const mv5_w_d4 = makeChessTree(
  // prettier-ignore
  [ 'd4',   'exd4',
    'cxd4', 'Bb4+',
    'Bd2',
  ],
  [mv7_b_Nxe4, mv7_b_Bxd2Check],
);

const mv5_w_d3 = makeChessTree(
  // prettier-ignore
  [ 'd3',  'd6',
    'O-O',
  ],
  [],
);

const mv4_b_Nf6 = makeChessTree(
  // prettier-ignore
  [        'Nf6'
  ],
  [mv5_w_d3, mv5_w_d4],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
    'Nf3',  'Nc6',
    'Bc4', 'Bc5',
    'c3',
  ],
  [mv4_b_Nf6],
);

const attribution = new Attribution();
attribution.text = 'Based on a YouTube video by The Chess Giant';
attribution.url = 'https://www.youtube.com/watch?v=BPpSz2rbG3A';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'Giuoco Piano';
lesson.shortName = 'Giuoco Piano';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
