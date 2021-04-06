import React from 'react';
import { makeStyles } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles({
  formLabelRoot: {
    marginBottom: '0.75rem',
    color: 'white',
    '&$formLabelFocused': { color: 'white' },
  },
  formLabelFocused: {
    color: 'white',
  },
});

export interface Props {
  label: string;
  optionTexts: string[];
  selectedValue: string;
  changeSelectedValue: (newValue: string) => void;
}

const RadioInputGroup: React.FC<Props> = (props) => {
  const classes = useStyles();

  return (
    <FormControl component='fieldset'>
      <FormLabel
        classes={{
          root: classes.formLabelRoot,
          focused: classes.formLabelFocused,
        }}
        component='legend'
      >
        {props.label}
      </FormLabel>
      <RadioGroup
        aria-label={props.label}
        name={props.label}
        value={props.selectedValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.changeSelectedValue(e.target.value);
        }}
      >
        {props.optionTexts.map((optionText) => (
          <FormControlLabel
            key={`${props.label} ${optionText}`}
            value={optionText}
            checked={optionText === props.selectedValue}
            control={<Radio />}
            label={optionText}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioInputGroup;
