import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

// Classical variation
const mv6_w_Be2 = makeChessTree(
  // prettier-ignore
  [ 'Be2',  'Bg7',
    'O-O',  'O-O',
    'Be3',  'Nc6',
  ],
  [],
);

// Yugoslav Attack
const mv6_w_Be3 = makeChessTree(
  // prettier-ignore
  [ 'Be3',  'Bg7',
    'f3',   'O-O',
    'Qd2',  'Nc6',
    'O-O-O', 'd5',
  ],
  [],
);

// Levenfish Variation
const mv6_w_f4 = makeChessTree(
  // prettier-ignore
  [
    'f4',   'Nc6',
    'Nxc6', 'bxc6',
    'e5',   'Nd7',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'c5',
    'Nf3',  'd6',
    'd4',   'cxd4',
    'Nxd4', 'Nf6',
    'Nc3',  'g6',
  ],
  [mv6_w_Be2, mv6_w_Be3, mv6_w_f4],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'Sicilian: Dragon Variation';
lesson.shortName = 'Sicilian Dragon';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;

export default lesson;
