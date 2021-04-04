import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const mv9_w_Nxe5 = makeChessTree(
  // prettier-ignore
  [
    'Nxe5', 'Nxe4',
    'Nxe4', 'Bxe5',
  ],
  [],
);

const mv9_w_Bg5 = makeChessTree(
  // prettier-ignore
  [
    'Bg5',  'Re8',
    'Nd5',  'Nxd5',
    'cxd5', 'c6',
    'Bc4',  'cxd5',
    'Bxd5', 'Nd7',
    'O-O',  'h6',
    'Be3',  'Nf6',
    'Bb3',  'Nxe4',
  ],
  [],
);

const mv9_w_Ne1 = makeChessTree(
  // prettier-ignore
  [
    'Ne1',  'Nd7',
    'Be3',  'f5',
    'f3',   'f4',
    'Bf2',  'g5',
    'b4',   'Nf6',
    'c5',   'Ng6',
    'cxd6', 'cxd6',
    'Rc1',  'Rf7',
    'a4',   'Bf8',
    'a5',   'Bd7',
    'Nb5',  'g4',
    'Nc7',  'g3',
    'Nxa8', 'Nh5',
    'Kh1',  'gxf2',
    'Rxf2',  'Ng3+',
    'Kg1',  'Qxa8',
    'Bc4',  'a6',
    'Qd3',  'Qa7',
    'b5',  'axb5',
    'Bxb5',  'Nh1',
  ],
  [],
);

// Bayonet Attack
const mv9_w_b4 = makeChessTree(
  // prettier-ignore
  [
    'b4',   'a5',
    'Ba3',  'axb4',
    'Bxb4', 'b6',
    'a4',   'Ne8',
    'a5',   'c5',
    'dxc6', 'Nxc6',
  ],
  [],
);

const mv7_w_OO = makeChessTree(
  // prettier-ignore
  [ 'O-O',  'Nc6',
    'd5',   'Ne7',
  ],
  [mv9_w_Ne1, mv9_w_b4],
);

// Petrosian Variation
const mv7_w_d5 = makeChessTree(
  // prettier-ignore
  [ 'd5',   'a5',
    'Bg5',  'h6',
    'Bh4',  'Na6',
    'Nd2',  'Qe8',
    'O-O',  'Bd7',
    'b3',   'Nh7',
    'f3',   'h5',
    'a3',   'Bh6',
  ],
  [],
);

// Orthodox, Exchange Variation
const mv7_w_dxe5 = makeChessTree(
  // prettier-ignore
  [
    'dxe5', 'dxe5',
    'Qxd8', 'Rxd8',
  ],
  [mv9_w_Nxe5, mv9_w_Bg5],
);

const mv7_w_Be3 = makeChessTree(
  // prettier-ignore
  [
    'Be3',  'Ng4',
    'Bg5',  'f6',
    'Bh4',  'Nc6',
  ],
  [],
);

const mv5_w_Nf3 = makeChessTree(
  // prettier-ignore
  [ 'Nf3',  'O-O',
    'Be2',  'e5',
  ],
  [mv7_w_dxe5, mv7_w_OO, mv7_w_Be3, mv7_w_d5],
);

// Averbakh Variation
const mv5_w_Be2 = makeChessTree(
  // prettier-ignore
  [ 'Be2', 'O-O',
    'Bg5', 'c5',
    'd5',  'Na6',
    'Nf3', 'Nc7',
  ],
  [],
);

// Samisch Variation
const mv5_w_f3 = makeChessTree(
  // prettier-ignore
  [ 'f3',  'O-O',
    'Be3', 'c5',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'Nf6',
    'c4',   'g6',
    'Nc3',  'Bg7',
    'e4',   'd6',
  ],
  [mv5_w_Nf3, mv5_w_Be2, mv5_w_f3],
);

const attribution = new Attribution();
attribution.text = 'Based on videos by ChessCoach Andras and thechesswebsite';
attribution.url =
  'https://www.youtube.com/watch_videos?video_ids=ySR-X31bgOQ,ZtGLHip7yk4';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = "King's Indian Defense";
lesson.shortName = 'Kings Indian';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
