import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core';
import ChessTrapFiltersModal from './ChessTrapFiltersModal';
import { ChessTrapFiltersToolkit } from '../hooks/useChessTrapFilters';

const useStyles = makeStyles((theme: Theme) => ({
  filtersModalUIRoot: {
    padding: '8px 4px',
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: '6px',
    width: '85%',
    margin: '0 auto',
  },
  addFiltersBtn: {
    margin: '2px auto',
    display: 'block',
  },
  msgText: {
    fontSize: '0.85rem',
  },
}));

export interface Props {
  chessTrapFiltersToolkit: ChessTrapFiltersToolkit;
}

const ChessTrapFiltersModalUI: React.FC<Props> = (props) => {
  const classes = useStyles();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    areAnyFiltersEnabled,
    selectedColor,
    selectedOpening,
  } = props.chessTrapFiltersToolkit;

  const MsgText: React.FC = (props) => (
    <Typography align='center' className={classes.msgText}>
      {props.children}
    </Typography>
  );

  const makeSelectedColorMsg = (): JSX.Element => {
    if (selectedColor == null) {
      throw new Error('selectedColor was unexpectedly null');
    } else {
      return <MsgText>Color: {selectedColor}</MsgText>;
    }
  };

  const makeSelectedOpeningMsg = (): JSX.Element => {
    if (selectedOpening == null) {
      throw new Error('selectedOpening was unexpectedly null');
    } else {
      return <MsgText>Opening: {selectedOpening}</MsgText>;
    }
  };

  const makeFilteringMsg = (): JSX.Element => {
    if (!areAnyFiltersEnabled()) {
      return <MsgText>No active filters</MsgText>;
    } else if (selectedColor != null && selectedOpening != null) {
      return (
        <Grid container justify='space-around'>
          <Grid item>{makeSelectedColorMsg()}</Grid>
          <Grid item>{makeSelectedOpeningMsg()}</Grid>
        </Grid>
      );
    } else if (selectedColor != null) {
      return makeSelectedColorMsg();
    } else {
      return makeSelectedOpeningMsg();
    }
  };

  return (
    <div className={classes.filtersModalUIRoot}>
      <Grid container direction='column' spacing={2}>
        <Grid item>{makeFilteringMsg()}</Grid>
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            className={classes.addFiltersBtn}
            onClick={() => setIsModalOpen(true)}
          >
            {areAnyFiltersEnabled() ? 'Edit' : 'Add'} Filters
          </Button>
        </Grid>
      </Grid>
      <ChessTrapFiltersModal
        {...props}
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ChessTrapFiltersModalUI;
