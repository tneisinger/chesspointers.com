import React from 'react';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  spinnerParent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

const Spinner: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.spinnerParent}>
      <CircularProgress />
    </div>
  );
};

export default Spinner;
