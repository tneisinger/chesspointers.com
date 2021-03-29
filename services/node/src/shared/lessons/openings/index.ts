import { Lesson } from '../../entity/lesson';
import vienna from './vienna';
import giuocoPiano from './giuocoPiano';
import caroKann from './caroKann';
import scandinavian from './scandinavian';
import kingsIndian from './kingsIndian';
import sicilianDragon from './sicilianDragon';

const allOpenings: { [shortName: string]: Lesson } = {
  vienna: vienna,
  giuocoPiano: giuocoPiano,
  caroKann: caroKann,
  scandinavian: scandinavian,
  kingsIndian: kingsIndian,
  sicilianDragon: sicilianDragon,
};

export default allOpenings;
