import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ChessOpening } from '../../shared/chessTypes';

const useStyles = makeStyles({
  inputLabel: {
    '&.Mui-focused': {
      color: 'white',
    },
  },
});

interface Props {
  selectedOpening: ChessOpening | '';
  onChange: (opening: string) => void;
  size?: 'medium' | 'small';
}

const ChessOpeningsDropDown: React.FC<Props> = ({
  selectedOpening,
  onChange,
  size = 'medium',
}) => {
  const classes = useStyles({ size });

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item>
        <FormControl>
          <InputLabel className={classes.inputLabel} shrink id='chess-openings-dropdown'>
            Opening
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: 'Opening',
              id: 'chess-openings-dropdown',
            }}
            id='chess-openings-dropdown'
            value={selectedOpening}
            onChange={(e) => onChange(e.target.value as ChessOpening)}
          >
            <option value=''>None</option>
            {Object.values(ChessOpening).map((opening) => (
              <option key={opening} value={opening}>
                {opening}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ChessOpeningsDropDown;
