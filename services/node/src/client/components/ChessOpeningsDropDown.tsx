import React, { MutableRefObject } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ChessOpening } from '../../shared/chessTypes';

const useStyles = makeStyles({
  autocomplete: {
    minWidth: (p: { size: string }) => (p.size === 'medium' ? 225 : 200),
  },
});

interface Props {
  selectedOpening: ChessOpening | null;
  onChange: (opening: ChessOpening | null) => void;
  textFieldRef?: MutableRefObject<HTMLInputElement | null>;
  size?: 'medium' | 'small';
}

const ChessOpeningsDropDown: React.FC<Props> = ({
  selectedOpening,
  onChange,
  textFieldRef = undefined,
  size = 'medium',
}) => {
  const classes = useStyles({ size });

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item>
        <Autocomplete
          value={selectedOpening}
          size={size}
          className={classes.autocomplete}
          options={[null, ...Object.values(ChessOpening)]}
          getOptionLabel={(option) => (option == null ? 'None' : option)}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={textFieldRef}
              label='Chess Opening'
              variant='outlined'
            />
          )}
          onChange={(_event: any, newValue) => {
            onChange(newValue);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ChessOpeningsDropDown;
