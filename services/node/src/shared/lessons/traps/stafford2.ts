import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const Qxd1 = {
  move: 'Qxd1',
  teachingPriority: 900,
};

const Qe4_check = {
  move: 'Qe4+',
  teachingPriority: -900,
};

const branch_Kxf2 = makeChessTree(['Kxf2', Qxd1], []);

const branch_Ke2 = makeChessTree(
  // prettier-ignore
  [
    'Ke2', 'Bg4+',
    'Kxf2', 'Qxd1',
  ],
  [],
);

const branch_d3 = makeChessTree(
  // prettier-ignore
  [
    'd3',   'Bc5',
    'dxe4', 'Bxf2+',
  ],
  [branch_Kxf2, branch_Ke2],
);

const branch_d4 = makeChessTree(
  // prettier-ignore
  [
    'd4',   'Qh4',
    'g3',   'Nxg3',
    'fxg3',  Qe4_check,
  ],
  [],
);

const e5 = { move: 'e5', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4',   'e5',
    'Nf3',  'Nf6',
    'Nxe5', 'Nc6',
    'Nxc6', 'dxc6',
     e5,    'Ne4',
  ],
  [branch_d3, branch_d4],
);

const attribution = new Attribution();
attribution.text = 'Based on a YouTube video by Eric Rosen';
attribution.url = 'https://youtu.be/nH_fiqlLp2U?t=103';

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'Stafford Gambit: Part 2';
lesson.shortName = 'Stafford 2';
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
