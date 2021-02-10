import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import ScrollablePane from './ScrollablePane';
import ChessTrapsSelector from './ChessTrapsSelector';
import allChessTraps from '../../shared/chessTraps';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { filterTrapsWithOpenings } from '../../shared/chessTree';
import { partition } from '../../shared/utils';
import SelectTrapsPaneControls from './SelectTrapsPaneControls';

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
      title='Traps'
      height={props.height}
      subheadingComponent={
        <SelectTrapsPaneControls
          userColor={props.userColor}
          setUserColor={props.setUserColor}
          selectedOpening={selectedOpening}
          setSelectedOpening={setSelectedOpening}
          numSelectedTraps={props.selectedTraps.length}
          deselectAll={() => props.setSelectedTraps([])}
          openingsTextFieldRef={openingsTextFieldRef}
        />
      }
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
