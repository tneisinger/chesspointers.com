import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

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

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'd5',
    'exd5', 'Qxd5',
    'Nc3',  'Qa5',
    'd4',   'Nf6',
    'Nf3',  'c6',
    'Bc4',  'Bf5',
    'Bd2',  'e6',
  ],
  [mv8_w_Nd5, mv8_w_Qe2, mv8_w_Ne4],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'The Scandinavian Defense';
lesson.shortName = 'Scandinavian';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;

export default lesson;
