import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';
import { Opening } from '../../shared/entity/opening';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DisplayTraps from '../components/DisplayTraps';
import useDimensions from 'react-use-dimensions';
import { getOpeningsThunk } from '../redux/openingsSlice';
import { RootState } from '../redux/store';
import WithReduxSlice from '../components/WithReduxSlice';
import { OpeningsSlice } from '../redux/openingsSlice';

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
    height: '100%',
  },
}));

const OpeningsPageContent: React.FC<OpeningsSlice> = (props) => {
  const classes = useStyles();

  const [rootDivRef, rootDivDimensions] = useDimensions();

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
          {props.openings.map((opening) => (
            <p key={opening.shortName}>{opening.shortName}</p>
          ))}
        </Grid>
      </Grid>
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
