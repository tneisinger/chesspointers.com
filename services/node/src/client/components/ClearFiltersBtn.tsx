import React from 'react';
import Button from '@material-ui/core/Button';
import { TrapFiltersToolkit } from '../hooks/useTrapFilters';

export interface Props {
  chessTrapFiltersToolkit: TrapFiltersToolkit;
}

const ClearFiltersBtn: React.FC<Props> = ({ chessTrapFiltersToolkit }) => {
  const { clearFilters, areAnyFiltersEnabled } = chessTrapFiltersToolkit;
  return (
    <Button variant='contained' onClick={clearFilters} disabled={!areAnyFiltersEnabled()}>
      Clear Filters
    </Button>
  );
};

export default ClearFiltersBtn;
