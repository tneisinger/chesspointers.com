import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import ScrollablePane from './ScrollablePane';
import ChessTrapsSelector from './ChessTrapsSelector';
import allChessTraps from '../../shared/chessTraps';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import ColorSwitch from './ColorSwitch';
import ChessOpeningsDropDown from './ChessOpeningsDropDown';
import { filterTrapsWithOpenings } from '../../shared/chessTree';
import { partition } from '../../shared/utils';

interface Props {
  height: number;
  selectedTraps: ChessTrap[];
  setSelectedTraps: Dispatch<SetStateAction<ChessTrap[]>>;
  userColor: PieceColor;
  setUserColor: Dispatch<SetStateAction<PieceColor>>;
}

const SelectTrapsPane: React.FC<Props> = (props) => {
  const [[whiteTraps, blackTraps]] = useState<[ChessTrap[], ChessTrap[]]>(
    partition(Object.values(allChessTraps), (t) => t.playedByWhite),
  );

  const getUserColorTraps = () => (props.userColor === 'white' ? whiteTraps : blackTraps);

  const [listedTraps, setListedTraps] = useState<ChessTrap[]>(getUserColorTraps());
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening | null>(null);

  const openingsTextFieldRef = useRef<HTMLInputElement | null>(null);

  const filterTraps = (traps: ChessTrap[]): ChessTrap[] => {
    if (selectedOpening == null) {
      return traps;
    } else {
      return filterTrapsWithOpenings([selectedOpening], traps);
    }
  };

  const unsetSelectedOpening = () => {
    if (openingsTextFieldRef.current != null) {
      openingsTextFieldRef.current.value = '';
    }
    setSelectedOpening(null);
  };

  useEffect(() => {
    setListedTraps(filterTraps(getUserColorTraps()));
    if (selectedOpening != null) {
      const filtered = filterTraps(props.selectedTraps);
      if (filtered.length < props.selectedTraps.length) {
        props.setSelectedTraps(filtered);
      }
    }
  }, [selectedOpening]);

  useEffect(() => {
    setListedTraps(filterTraps(getUserColorTraps()));
    props.setSelectedTraps([]);
  }, [props.userColor]);

  return (
    <ScrollablePane
      subheadingComponent={
        <Grid container alignItems='center' direction='column' spacing={1}>
          <Grid item>
            <ColorSwitch
              selectedColor={props.userColor}
              setSelectedColor={props.setUserColor}
              size='small'
            />
          </Grid>
          <Grid item>
            <ChessOpeningsDropDown
              selectedOpening={selectedOpening}
              onChange={setSelectedOpening}
              size='small'
              textFieldRef={openingsTextFieldRef}
            />
          </Grid>
        </Grid>
      }
      height={props.height}
      title='Traps'
    >
      <ChessTrapsSelector
        traps={listedTraps}
        selectedTraps={props.selectedTraps}
        setSelectedTraps={props.setSelectedTraps}
        clearFilters={unsetSelectedOpening}
      />
    </ScrollablePane>
  );
};

export default SelectTrapsPane;
