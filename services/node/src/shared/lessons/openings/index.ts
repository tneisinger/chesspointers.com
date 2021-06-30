import { Lesson } from '../../entity/lesson';
import vienna from './vienna';
import giuocoPiano from './giuocoPiano';
import caroKann from './caroKann';
import scandinavian from './scandinavian';
import kingsIndian from './kingsIndian';
import sicilianDragon from './sicilianDragon';
import sicilianAlapin from './sicilianAlapin';
import nimzoIndian from './nimzoIndian';
import queensGambit from './queensGambit';
import qgdRagozin from './qgdRagozin';

const allOpenings: { [shortName: string]: Lesson } = {
  vienna: vienna,
  giuocoPiano: giuocoPiano,
  caroKann: caroKann,
  scandinavian: scandinavian,
  kingsIndian: kingsIndian,
  sicilianDragon: sicilianDragon,
  sicilianAlapin: sicilianAlapin,
  nimzoIndian: nimzoIndian,
  queensGambit: queensGambit,
  qgdRagozin: qgdRagozin,
};

export default allOpenings;
