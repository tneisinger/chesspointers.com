import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { PieceColor } from '../../shared/chessTypes';
import ColorSwitch from './ColorSwitch';

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

const ColorSwitchWithCheckbox: React.FC<Props> = (props) => {
  const classes = useStyles(props);

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
        <ColorSwitch
          selectedColor={props.selectedColor}
          setSelectedColor={props.setSelectedColor}
          isEnabled={props.isEnabled}
        />
      </Grid>
    </Grid>
  );
};

export default ColorSwitchWithCheckbox;
