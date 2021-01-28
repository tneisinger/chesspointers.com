import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import { PieceColor } from '../../shared/chessTypes';

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    marginTop: '10px',
    color: (props: Props) =>
      props.isEnabled ? theme.palette.text.primary : theme.palette.text.disabled,
  },
  toggleSwitch: {
    marginTop: '3px',
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

  return (
    <Grid container spacing={4}>
      <Grid item>
        <Checkbox
          checked={props.isEnabled}
          onChange={() => props.setIsEnabled(!props.isEnabled)}
        />
      </Grid>
      <Grid item>
        <Grid container justify='center' spacing={1}>
          <Grid item>
            <Typography className={classes.label}>White</Typography>
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
            <Typography className={classes.label}>Black</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ColorSwitch;
