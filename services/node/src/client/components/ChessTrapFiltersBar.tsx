import React, { RefObject, useState, useEffect, MutableRefObject } from 'react';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AppBar from '@material-ui/core/AppBar';
import ColorSwitchWithCheckbox from './ColorSwitchWithCheckbox';
import ChessOpeningsDropDown from './ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { filterTrapsWithOpenings } from '../../shared/chessTree';
import NoMatchesModal from './NoMatchesModal';

const useStyles = makeStyles((theme: Theme) => ({
  contentGridContainer: {
    height: '100%',
    width: '100vw',
    maxWidth: 800,
    margin: '0 auto',
  },
  verticallyCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.palette.text.primary,
  },
  filtersBar: {
    opacity: 0.95,
    padding: '8px 4px',
    position: 'fixed',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 'auto',
    bottom: 0,
  },
}));

interface Props {
  allTraps: ChessTrap[];
  setSelectedTraps: (traps: ChessTrap[]) => void;
  filtersBarRef: MutableRefObject<any> | RefObject<HTMLDivElement>;
}

const ChessTrapFiltersBar: React.FC<Props> = ({
  allTraps,
  setSelectedTraps,
  filtersBarRef,
}) => {
  const classes = useStyles({});

  const [selectedColor, setSelectedColor] = useState<PieceColor>('white');
  const [isColorFilterEnabled, setIsColorFilterEnabled] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening | ''>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filterTraps = () => {
    let filteredTraps = allTraps;
    if (isColorFilterEnabled) {
      filteredTraps = filteredTraps.filter(
        (trap) => trap.playedByWhite === (selectedColor === 'white'),
      );
    }
    if (selectedOpening !== '') {
      filteredTraps = filterTrapsWithOpenings([selectedOpening], filteredTraps);
    }
    setSelectedTraps(filteredTraps);
    if (filteredTraps.length < 1) {
      setIsModalOpen(true);
    }
  };

  const areAnyFiltersEnabled = (): boolean =>
    isColorFilterEnabled || selectedOpening !== null;

  const clearFilters = () => {
    setIsColorFilterEnabled(false);
    setSelectedOpening('');
  };

  const handleOpeningsDropdownChange = (opening: string) => {
    if (opening === '') {
      setSelectedOpening(opening);
    } else if (Object.values(ChessOpening).includes(opening as ChessOpening)) {
      setSelectedOpening(opening as ChessOpening);
    } else {
      throw new Error(`Unrecognized chess opening: ${opening}`);
    }
  };

  // Whenever any filter option changes...
  useEffect(() => {
    filterTraps();
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [isColorFilterEnabled, selectedColor, selectedOpening]);

  return (
    <AppBar ref={filtersBarRef} className={classes.filtersBar} color='default'>
      <div className={classes.contentGridContainer}>
        <Grid container direction='row' alignItems='center' justify='space-evenly'>
          <Grid item>
            <Typography variant='h5' component='label'>
              Filter By:
            </Typography>
          </Grid>
          <Grid item>
            <ColorSwitchWithCheckbox
              isEnabled={isColorFilterEnabled}
              setIsEnabled={setIsColorFilterEnabled}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </Grid>
          <Grid item>
            <ChessOpeningsDropDown
              selectedOpening={selectedOpening}
              onChange={handleOpeningsDropdownChange}
            />
          </Grid>
          <Grid item className={classes.verticallyCentered}>
            <IconButton onClick={clearFilters} disabled={!areAnyFiltersEnabled()}>
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
      <NoMatchesModal
        isModalOpenOrOpening={isModalOpen}
        clearFilters={clearFilters}
        closeModal={() => setIsModalOpen(false)}
      />
    </AppBar>
  );
};

export default ChessTrapFiltersBar;
