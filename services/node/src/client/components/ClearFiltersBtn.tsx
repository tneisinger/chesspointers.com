import React from 'react';
import Button from '@material-ui/core/Button';
import { FiltersToolkit } from '../hooks/useLessonFilters';

export interface Props {
  filtersToolkit: FiltersToolkit;
}

const ClearFiltersBtn: React.FC<Props> = ({ filtersToolkit }) => {
  const { clearFilters, areAnyFiltersEnabled } = filtersToolkit;
  return (
    <Button variant='contained' onClick={clearFilters} disabled={!areAnyFiltersEnabled()}>
      Clear Filters
    </Button>
  );
};

export default ClearFiltersBtn;
