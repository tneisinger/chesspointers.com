import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';

const Nc3 = { move: 'Nc3', isPreviewPosition: true };

const branch_Nc6 = makeChessTree(
  // prettier-ignore
  [        'Nc6',
    'Bc4', 'Nf6',
    'd3',
  ],
  [],
);

const branch_Nf6 = makeChessTree(
  // prettier-ignore
  [         'Nf6',
    'd3',
  ],
  [],
);

const branch_Bc5 = makeChessTree(
  // prettier-ignore
  [        'Bc5',
    'Qh5', 'Qe7',
  ],
  [],
);

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
     Nc3,
  ],
  [branch_Nc6, branch_Nf6, branch_Bc5],
);

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = 'The Vienna Game';
lesson.shortName = 'Vienna';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;

export default lesson;
