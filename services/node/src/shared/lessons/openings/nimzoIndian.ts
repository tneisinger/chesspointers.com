import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const mv6_b_b6 = makeChessTree(
  // prettier-ignore
  [
           'b6',
    'Bg5', 'Bb7',
    'f3',  'h6',
    'Bh4', 'd5',
  ],
  [],
);

const mv6_b_d5 = makeChessTree(
  // prettier-ignore
  [
            'd5',
    'Nf3',  'dxc4',
    'Qxc4', 'b6',
    'Bg5',  'Ba6',
  ],
  [],
);

const mv4_b_OO = makeChessTree(
  // prettier-ignore
  [
           'O-O',
    'a3',  'Bxc3+',
    'Qxc3',
  ],
  [mv6_b_d5, mv6_b_b6],
);

const mv6_w_Nf3 = makeChessTree(
  // prettier-ignore
  [
    'Nf3', 'Na6',
  ],
  [],
);

const mv6_w_a3 = makeChessTree(
  // prettier-ignore
  [
    'a3',  'Bxc5',
    'Nf3', 'b6',
    'Bf4', 'Bb7',
    'Rd1', 'Nc6',
    'e3',  'Nh5',
    'Bg3', 'f5',
  ],
  [],
);

// Berlin Variation
const mv4_b_c5 = makeChessTree(
  // prettier-ignore
  [
            'c5',
    'dxc5', 'O-O',
  ],
  [mv6_w_Nf3, mv6_w_a3],
);

// Classical Line
const mv4_w_Qc2 = makeChessTree(
  // prettier-ignore
  [
    'Qc2',
  ],
  [mv4_b_OO, mv4_b_c5],
);

const mv5_w_Nge2 = makeChessTree(
  // prettier-ignore
  [
    'Ne2', 'd5',
    'a3', 'Be7',
    'cxd5', 'exd5',
    'Nf4', 'c6',
  ],
  [],
);

const mv5_w_Bd3 = makeChessTree(
  // prettier-ignore
  [
    'Bd3',  'd5',
    'Nf3',  'c5',
    'O-O',  'dxc4',
    'Bxc4', 'Nbd7',
    'Qe2',  'b6',
    'Rd1', 'cxd4',
    'exd4', 'Bb7',
    'd5', 'Bxc3',
    'dxe6', 'Bxf3',
    'gxf3', 'fxe6',
    'bxc3', 'Qc7',
    'Bxe6+', 'Kh8',
  ],
  [],
);

// Normal Line (Main line)
const mv4_w_e3 = makeChessTree(
  // prettier-ignore
  [
    'e3', 'O-O',
  ],
  [mv5_w_Bd3, mv5_w_Nge2],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'd4',   'Nf6',
    'c4',   'e6',
    'Nc3',  'Bb4',
  ],
  [mv4_w_Qc2, mv4_w_e3],
);

const attribution = new Attribution();
attribution.text = 'Based on a Youtube video by Hanging Pawns';
attribution.url = 'https://www.youtube.com/watch?v=xX_bnk7nKNg&t=29s';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = "Nimzo-Indian Defense";
lesson.shortName = 'Nimzo-Indian';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
