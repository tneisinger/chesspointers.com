import { Lesson } from '../../entity/lesson';
import vienna from './vienna';
import giuocoPiano from './giuocoPiano';
import caroKann from './caroKann';
import scandinavian from './scandinavian';

const allOpenings: { [shortName: string]: Lesson } = {
  vienna: vienna,
  giuocoPiano: giuocoPiano,
  caroKann: caroKann,
  scandinavian: scandinavian,
};

export default allOpenings;
