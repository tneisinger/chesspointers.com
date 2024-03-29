import React from 'react';
import { getViewportWidth } from '../utils';
import LessonFiltersModalUI, {
  Props as ModalUIProps,
} from '../components/LessonFiltersModalUI';
import LessonFiltersBar, {
  Props as FiltersBarProps,
} from '../components/LessonFiltersBar';

const BREAKPOINT = 800;

export function shouldDisplayFiltersBar(): boolean {
  return getViewportWidth() > BREAKPOINT;
}

type Props = FiltersBarProps & ModalUIProps;

const FiltersBarOrModalUI: React.FC<Props> = (props) => {
  if (shouldDisplayFiltersBar()) {
    return <LessonFiltersBar {...props} />;
  } else {
    return <LessonFiltersModalUI {...props} />;
  }
};

export default FiltersBarOrModalUI;
