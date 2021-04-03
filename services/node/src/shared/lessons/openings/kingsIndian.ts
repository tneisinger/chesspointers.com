import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const mv7_w_OO = makeChessTree(
  // prettier-ignore
  [ 'O-O', 'Nc6',
    'd5',  'Ne7',
    'b4',  'Nh5',
    'Re1', 'f5',
    'exf5', 'Bxf5',
  ],
  [],
);

const mv7_w_dxe5 = makeChessTree(
  // prettier-ignore
  [
    'dxe5', 'dxe5',
    'Qxd8', 'Rxd8',
    'Nxe5', 'Nxe4',
    'Nxe4', 'Bxe5',
  ],
  [],
);

const mv5_w_Nf3 = makeChessTree(
  // prettier-ignore
  [ 'Nf3',  'O-O',
    'Be2',  'e5',
  ],
  [mv7_w_dxe5, mv7_w_OO],
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
attribution.text = 'Based on a YouTube video by thechesswebsite';
attribution.url = 'https://www.youtube.com/watch?v=ZtGLHip7yk4';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = "King's Indian Defense";
lesson.shortName = 'Kings Indian';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
