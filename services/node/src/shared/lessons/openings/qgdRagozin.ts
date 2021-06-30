import { Lesson, LessonType } from '../../entity/lesson';
import { makeChessTreeFromPGNString } from '../../pgnToChessTree';
import { Attribution } from '../../entity/attribution';

const chessTree = makeChessTreeFromPGNString(`
1. d4 d5 (1... Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Bb4 5. e3 (5. Qb3 c5 6. dxc5 Nc6 7.
Bg5 Qa5 8. Bxf6 dxc4 9. Qxc4 gxf6) (5. Bg5 h6 6. Bh4 (6. Bxf6 Qxf6 7. e3
O-O 8. Rc1 dxc4 9. Bxc4 c5 10. O-O cxd4 11. Nxd4 Bd7 12. Qb3 Nc6 13. Nxc6 Bxc3
14. Rxc3 Bxc6) 6... dxc4) 5... O-O 6. Bd3 c5) 2. c4 e6 3. Nc3 Nf6 4. Nf3 Bb4 5.
Qa4+ (5. cxd5 exd5 6. Bg5 h6 7. Bh4 c5 8. e3 (8. dxc5 Nbd7 9. e3 Qa5 10. Nd2
Bxc3 11. bxc3 O-O) 8... c4 9. Nd2 g5 10. Bg3 Bf5 11. h4 Rg8) 5... Nc6 6. e3 (6.
Bg5 h6 7. Bh4 (7. Bxf6 Qxf6 8. e3 O-O 9. Be2 Bd7 10. Qb3 dxc4 11. Qxc4 Qg6 12.
O-O Bd6) 7... dxc4 8. e3 Bd7 9. Bxc4 Bxc3+ 10. bxc3 Nxd4 11. Qd1 Nf5) 6... O-O
7. Bd2 dxc4 8. Bxc4 Bd6 9. Qc2 e5 10. dxe5 Nxe5 11. Nxe5 Bxe5 12. f4 Bxc3 13.
Bxc3 Ng4 14. Bd4 c5 15. Bxc5 Re8 *
`);

const attribution = new Attribution();
attribution.text = 'Based on a Youtube video by Hanging Pawns';
attribution.url = 'https://youtu.be/6oRtSS4lENo';

const lesson = new Lesson();
lesson.lessonType = LessonType.OPENING;
lesson.fullName = "QGD: Ragozin Defense";
lesson.shortName = "Ragozin Defense";
lesson.playedByWhite = false;
lesson.chessTree = chessTree;
lesson.attribution = attribution;

export default lesson;
