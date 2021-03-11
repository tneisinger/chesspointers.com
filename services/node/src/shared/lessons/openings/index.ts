import { Lesson } from '../../entity/lesson';
import vienna from './vienna';
import giuocoPiano from './giuocoPiano';
import caroKann from './caroKann';

const allOpenings: { [shortName: string]: Lesson } = {
  vienna: vienna,
  giuocoPiano: giuocoPiano,
  caroKann: caroKann,
};

export default allOpenings;
