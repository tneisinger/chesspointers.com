import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTree } from '../../chessTree';
import { Attribution } from '../../entity/attribution';

const Nxe5 = { move: 'Nxe5', isPreviewPosition: true };

const chessTree = makeChessTree(
  // prettier-ignore
  [ 'e4', 'e5',
    'Nf3', 'Nc6',
    'Bc4', 'd6',
    'Nc3', 'Bg4',
    'h3', 'Bh5',
     Nxe5, 'Bxd1',
    'Bxf7+', 'Ke7',
    'Nd5#'
  ],
  [],
);

const attribution = new Attribution();
attribution.text = 'Based on a YouTube video by thechesswebsite';
attribution.url = 'https://youtu.be/tYOnym3ZINU?t=43';

const lesson = new Lesson();
lesson.lessonType = LessonType.TRAP;
lesson.fullName = 'The Legal Trap';
lesson.shortName = 'Legal';
lesson.playedByWhite = true;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
