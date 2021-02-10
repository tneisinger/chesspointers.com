import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
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
    marginTop: (p: Props) => (p.size === 'small' ? 0 : '3px'),
  },
}));

interface Props {
  selectedColor: PieceColor;
  setSelectedColor: Dispatch<SetStateAction<PieceColor>>;
  isEnabled?: boolean;
  size?: 'small' | 'medium';
}

const ColorSwitch: React.FC<Props> = ({
  selectedColor,
  setSelectedColor,
  isEnabled = true,
  size = 'medium',
}) => {
  const classes = useStyles({ selectedColor, setSelectedColor, size, isEnabled });

  const toggleSelectedColor = () => {
    selectedColor === 'black' ? setSelectedColor('white') : setSelectedColor('black');
  };

  const getLabelClasses = (color: PieceColor): string => {
    if (isEnabled && selectedColor === color) {
      return `${classes.label} ${classes.selectedLabel}`;
    }
    return classes.label;
  };

  return (
    <Grid container direction='row'>
      <Grid item>
        <Typography
          variant={size === 'small' ? 'caption' : 'body1'}
          className={getLabelClasses('white')}
        >
          White
        </Typography>
      </Grid>
      <Grid item>
        <Switch
          size={size}
          disabled={!isEnabled}
          className={classes.toggleSwitch}
          checked={selectedColor === 'black'}
          onChange={toggleSelectedColor}
          name='selectColor'
          color='default'
          inputProps={{ 'aria-label': 'Select piece color' }}
        />
      </Grid>
      <Grid item>
        <Typography
          variant={size === 'small' ? 'caption' : 'body1'}
          className={getLabelClasses('black')}
        >
          Black
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ColorSwitch;
