import React, { useState, ReactElement } from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { Lesson } from '../../shared/entity/lesson';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DisplayLessons from '../components/DisplayLessons';
import useDimensions from 'react-use-dimensions';
import { RootState } from '../redux/store';
import WithReduxSlice from '../components/WithReduxSlice';
import { EntitiesSlice } from '../redux/types';
import useLessonFilters from '../hooks/useLessonFilters';
import NoMatchesModal from '../components/NoMatchesModal';
import AppThunk from '../redux/appThunk';
import FiltersBarOrModalUI, {
  shouldDisplayFiltersBar,
} from '../components/FiltersBarOrModalUI';

const useStyles = makeStyles((theme: Theme) => ({
  titleText: {
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '2.25rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  lessonsRoot: {
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

interface Props<Slice extends EntitiesSlice<Lesson>> {
  reduxThunk: () => AppThunk;
  reduxSelector: (state: RootState) => Slice;
  pageTitle: string;
}

const LessonsPage = <S extends EntitiesSlice<Lesson>>(props: Props<S>): ReactElement => {
  return (
    <WithReduxSlice
      WrappedComponent={LessonsPageContent as any}
      componentExtraProps={{ pageTitle: props.pageTitle }}
      {...props}
    />
  );
};

interface PageContentProps extends EntitiesSlice<Lesson> {
  pageTitle: string;
}

const LessonsPageContent: React.FC<PageContentProps> = (props) => {
  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [isNoMatchesModalOpen, setIsNoMatchesModalOpen] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);

  const onFiltersChange = (currentFilteredLessons: Lesson[]) => {
    if (currentFilteredLessons.length < 1) {
      setIsNoMatchesModalOpen(true);
    }
  };

  const filtersToolkit = useLessonFilters({
    unfilteredLessons: props.entities,
    changeFilteredLessons: setFilteredLessons,
    onFiltersChange,
  });

  const classes = useStyles({ filterBarHeight: filtersBarDimensions.height });

  return (
    <>
      <Grid
        container
        direction='column'
        justify='space-evenly'
        className={classes.lessonsRoot}
      >
        <Grid item>
          <Typography variant='h3' align='center' className={classes.titleText}>
            {props.pageTitle}
          </Typography>
        </Grid>
        <Grid item>
          <DisplayLessons
            allowAnimation={true}
            lessons={filteredLessons}
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

export default LessonsPage;
