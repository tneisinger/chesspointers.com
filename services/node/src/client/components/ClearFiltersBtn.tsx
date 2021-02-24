import React from 'react';
import Button from '@material-ui/core/Button';
import { ChessTrapFiltersToolkit } from '../hooks/useChessTrapFilters';

export interface Props {
  chessTrapFiltersToolkit: ChessTrapFiltersToolkit;
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
