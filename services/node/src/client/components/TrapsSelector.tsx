import React, { Dispatch, SetStateAction } from 'react';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { Trap } from '../../shared/entity/trap';

interface Props {
  traps: Trap[];
  selectedTraps: Trap[];
  setSelectedTraps: Dispatch<SetStateAction<Trap[]>>;
  clearFilters: () => void;
}

const TrapsSelector: React.FunctionComponent<Props> = ({
  traps,
  selectedTraps,
  setSelectedTraps,
  clearFilters,
}) => {
  const isTrapSelected = (trap: Trap): boolean =>
    selectedTraps.map((t) => t.shortName).includes(trap.shortName);

  const handleTrapSelectChange = (
    trap: Trap,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked && !isTrapSelected(trap)) {
      setSelectedTraps([...selectedTraps, trap]);
    } else if (!event.target.checked && isTrapSelected(trap)) {
      setSelectedTraps(selectedTraps.filter((t) => t.shortName !== trap.shortName));
    }
  };

  if (traps.length < 1) {
    return (
      <Box
        display='flex'
        alignItems='center'
        alignContent='center'
        justifyContent='center'
        flexDirection='column'
        css={{ height: '80%' }}
      >
        <Box mb={1}>
          <Typography align='center'>No matching traps</Typography>
        </Box>
        <Button variant='contained' color='secondary' onClick={clearFilters}>
          Clear Filters
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <List>
        {traps.map((trap) => (
          <ListItem dense key={trap.shortName}>
            <FormControlLabel
              label={<Typography variant='caption'>{trap.shortName}</Typography>}
              control={
                <Checkbox
                  name={trap.shortName}
                  size='small'
                  checked={selectedTraps.map((t) => t.shortName).includes(trap.shortName)}
                  onChange={(e) => handleTrapSelectChange(trap, e)}
                  color='default'
                />
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TrapsSelector;
