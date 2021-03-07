import React from 'react';
import { viewportWidth } from '../utils';
import TrapFiltersModalUI, {
  Props as ModalUIProps,
} from '../components/TrapFiltersModalUI';
import TrapFiltersBar, { Props as FiltersBarProps } from '../components/TrapFiltersBar';

const BREAKPOINT = 800;

export function shouldDisplayFiltersBar(): boolean {
  return viewportWidth() > BREAKPOINT;
}

type Props = FiltersBarProps & ModalUIProps;

const FiltersBarOrModalUI: React.FC<Props> = (props) => {
  if (shouldDisplayFiltersBar()) {
    return <TrapFiltersBar {...props} />;
  } else {
    return <TrapFiltersModalUI {...props} />;
  }
};

export default FiltersBarOrModalUI;
