import React, { MutableRefObject } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ChessOpening } from '../../shared/chessTypes';

const useStyles = makeStyles({
  autocomplete: {
    minWidth: 225,
  },
});

interface Props {
  selectedOpening: ChessOpening | null;
  onChange: (opening: ChessOpening | null) => void;
  textFieldRef: MutableRefObject<HTMLInputElement | null>;
}

const ChessOpeningsDropDown: React.FC<Props> = (props) => {
  const classes = useStyles({});

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item>
        <Autocomplete
          value={props.selectedOpening}
          className={classes.autocomplete}
          options={[null, ...Object.values(ChessOpening)]}
          getOptionLabel={(option) => (option == null ? 'None' : option)}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={props.textFieldRef}
              label='Chess Opening'
              variant='outlined'
            />
          )}
          onChange={(_event: any, newValue) => {
            props.onChange(newValue);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ChessOpeningsDropDown;
