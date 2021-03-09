import React, { useState } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { Lesson } from '../../shared/entity/lesson';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DisplayLessons from '../components/DisplayLessons';
import useDimensions from 'react-use-dimensions';
import { getOpeningsThunk } from '../redux/openingsSlice';
import { RootState } from '../redux/store';
import WithReduxSlice from '../components/WithReduxSlice';
import { OpeningsSlice } from '../redux/openingsSlice';
import useLessonFilters from '../hooks/useLessonFilters';
import NoMatchesModal from '../components/NoMatchesModal';
import FiltersBarOrModalUI, {
  shouldDisplayFiltersBar,
} from '../components/FiltersBarOrModalUI';

const useStyles = makeStyles((theme: Theme) => ({
  titleText: {
    [theme.breakpoints.up('sm')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  trapsRoot: {
    maxWidth: 'inherit',
    width: 'inherit',
    height: (p: { filterBarHeight: number }) => {
      if (shouldDisplayFiltersBar()) {
        return `calc(100% - ${p.filterBarHeight}px)`;
      } else {
        return '100%';
      }
    },
  },
}));

const OpeningsPageContent: React.FC<OpeningsSlice> = (props) => {
  const [rootDivRef, rootDivDimensions] = useDimensions();
  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const [filteredOpenings, setFilteredOpenings] = useState<Lesson[]>([]);
  const [isNoMatchesModalOpen, setIsNoMatchesModalOpen] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);

  const onFiltersChange = (currentFilteredOpenings: Lesson[]) => {
    if (currentFilteredOpenings.length < 1) {
      setIsNoMatchesModalOpen(true);
    }
  };

  const filtersToolkit = useLessonFilters({
    unfilteredLessons: props.openings,
    changeFilteredLessons: setFilteredOpenings,
    onFiltersChange,
  });

  const classes = useStyles({ filterBarHeight: filtersBarDimensions.height });

  return (
    <>
      <Grid
        container
        direction='column'
        justify='space-evenly'
        className={classes.trapsRoot}
        ref={rootDivRef}
      >
        <Grid item>
          <Typography variant='h3' align='center' className={classes.titleText}>
            Openings
          </Typography>
        </Grid>
        <Grid item>
          <DisplayLessons
            parentWidth={rootDivDimensions.width}
            allowAnimation={true}
            lessons={filteredOpenings}
          />
        </Grid>
        <Grid item>
          <FiltersBarOrModalUI
            filtersToolkit={filtersToolkit}
            filtersBarRef={filtersBarRef}
            isModalOpen={isFiltersModalOpen}
            setIsModalOpen={setIsFiltersModalOpen}
          />
        </Grid>
      </Grid>
      <NoMatchesModal
        isModalOpenOrOpening={isNoMatchesModalOpen}
        clearFilters={filtersToolkit.clearFilters}
        closeModal={() => setIsNoMatchesModalOpen(false)}
      />
    </>
  );
};

const TrapsPage: React.FC = () => {
  return (
    <WithReduxSlice
      WrappedComponent={OpeningsPageContent}
      reduxThunk={getOpeningsThunk}
      reduxSelector={(state: RootState) => state.openingsSlice}
    />
  );
};

export default TrapsPage;
