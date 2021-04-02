import React, { ReactElement } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core';
import { encodeWhiteSpaces } from '../../shared/utils';

const useStyles = makeStyles({
  root: {
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '4px',
    padding: '0 6px 6px 6px',
  },
  inputLabel: {
    '&.Mui-focused': {
      color: 'white',
    },
  },
  nativeSelect: {
    width: (p: { width: string }) => p.width,
  },
  option: {
    whiteSpace: 'pre',
  },
});

interface Props<E extends Record<string, string>> {
  selectedValue: E[keyof E] | '';
  enum: E;
  onChange: (value: string) => void;
  labelText: string;
  width?: string;
}

const DropDown = <E extends Record<string, string>>(props: Props<E>): ReactElement => {
  const width = props.width == undefined ? 'auto' : props.width;
  const classes = useStyles({ width });

  const inputId = `dropdown-${props.labelText}`;

  return (
    <div className={classes.root}>
      <FormControl>
        <InputLabel className={classes.inputLabel} shrink id={inputId}>
          {props.labelText}
        </InputLabel>
        <NativeSelect
          className={classes.nativeSelect}
          inputProps={{
            name: props.labelText,
            id: inputId,
          }}
          id={inputId}
          value={props.selectedValue}
          onChange={(e) => props.onChange(e.target.value as any)}
        >
          <option value=''>None</option>
          {Object.values(props.enum).map((value) => (
            <option key={value as string} value={value as string}>
              {encodeWhiteSpaces(value as string)}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </div>
  );
};

export default DropDown;
