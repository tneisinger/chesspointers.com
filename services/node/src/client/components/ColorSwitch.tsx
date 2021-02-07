import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import { PieceColor } from '../../shared/chessTypes';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '4px',
    padding: '6px 0',
    paddingRight: '12px',
  },
  label: {
    marginTop: '10px',
    color: theme.palette.text.secondary,
  },
  selectedLabel: {
    color: theme.palette.text.primary,
  },
  toggleSwitch: {
    marginTop: '3px',
  },
  checkbox: {
    padding: 0,
  },
  checkboxBackground: {
    background: (props: Props) =>
      props.isEnabled ? 'radial-gradient(white 55%, transparent 56%)' : 'transparent',
    margin: '9px',
  },
}));

interface Props {
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
  selectedColor: PieceColor;
  setSelectedColor: Dispatch<SetStateAction<PieceColor>>;
}

const ColorSwitch: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const toggleSelectedColor = () => {
    props.selectedColor === 'black'
      ? props.setSelectedColor('white')
      : props.setSelectedColor('black');
  };

  const getLabelClasses = (color: PieceColor): string => {
    if (props.isEnabled && props.selectedColor === color) {
      return `${classes.label} ${classes.selectedLabel}`;
    }
    return classes.label;
  };

  return (
    <Grid container direction='row' className={classes.root}>
      <Grid item>
        <div className={classes.checkboxBackground}>
          <Checkbox
            color='primary'
            className={classes.checkbox}
            checked={props.isEnabled}
            onChange={() => props.setIsEnabled(!props.isEnabled)}
          />
        </div>
      </Grid>
      <Grid item>
        <Typography className={getLabelClasses('white')}>White</Typography>
      </Grid>
      <Grid item>
        <Switch
          className={classes.toggleSwitch}
          disabled={!props.isEnabled}
          checked={props.selectedColor === 'black'}
          onChange={toggleSelectedColor}
          name='selectColor'
          color='default'
          inputProps={{ 'aria-label': 'Select piece color' }}
        />
      </Grid>
      <Grid item>
        <Typography className={getLabelClasses('black')}>Black</Typography>
      </Grid>
    </Grid>
  );
};

export default ColorSwitch;
