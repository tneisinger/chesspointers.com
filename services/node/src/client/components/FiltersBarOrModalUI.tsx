import React from 'react';
import { viewportWidth } from '../utils';
import ChessTrapFiltersModalUI, {
  Props as ModalUIProps,
} from '../components/ChessTrapFiltersModalUI';
import ChessTrapFiltersBar, {
  Props as FiltersBarProps,
} from '../components/ChessTrapFiltersBar';

const BREAKPOINT = 800;

export function shouldDisplayFiltersBar(): boolean {
  return viewportWidth() > BREAKPOINT;
}

type Props = FiltersBarProps & ModalUIProps;

const FiltersBarOrModalUI: React.FC<Props> = (props) => {
  if (shouldDisplayFiltersBar()) {
    return <ChessTrapFiltersBar {...props} />;
  } else {
    return <ChessTrapFiltersModalUI {...props} />;
  }
};

export default FiltersBarOrModalUI;
