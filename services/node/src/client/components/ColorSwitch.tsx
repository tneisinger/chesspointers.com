import React, { Dispatch, SetStateAction } from 'react';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import { PieceColor } from '../../shared/chessTypes';

interface Props {
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
  selectedColor: PieceColor;
  setSelectedColor: Dispatch<SetStateAction<PieceColor>>;
}

const ColorSwitch: React.FC<Props> = ({
  isEnabled,
  setIsEnabled,
  selectedColor,
  setSelectedColor,
}) => {
  const toggleSelectedColor = () => {
    selectedColor === 'black' ? setSelectedColor('white') : setSelectedColor('black');
  };

  return (
    <Grid container component='label' direction='row' justify='center' spacing={1}>
      <Grid item>
        <Checkbox checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} />
      </Grid>
      <Grid item>
        <Typography variant='caption'>White</Typography>
      </Grid>
      <Grid item>
        <Switch
          size='small'
          disabled={!isEnabled}
          checked={selectedColor === 'black'}
          onChange={toggleSelectedColor}
          name='selectColor'
          color='default'
          inputProps={{ 'aria-label': 'Select piece color' }}
        />
      </Grid>
      <Grid item>
        <Typography variant='caption'>Black</Typography>
      </Grid>
    </Grid>
  );
};

export default ColorSwitch;
