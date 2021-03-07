import React from 'react';
import Button from '@material-ui/core/Button';
import { TrapFiltersToolkit } from '../hooks/useTrapFilters';

export interface Props {
  trapFiltersToolkit: TrapFiltersToolkit;
}

const ClearFiltersBtn: React.FC<Props> = ({ trapFiltersToolkit }) => {
  const { clearFilters, areAnyFiltersEnabled } = trapFiltersToolkit;
  return (
    <Button variant='contained' onClick={clearFilters} disabled={!areAnyFiltersEnabled()}>
      Clear Filters
    </Button>
  );
};

export default ClearFiltersBtn;
