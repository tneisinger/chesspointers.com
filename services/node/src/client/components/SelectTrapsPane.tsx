import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import ScrollablePane from './ScrollablePane';
import TrapsSelector from './TrapsSelector';
import allTraps from '../../shared/lessons/traps';
import { Lesson } from '../../shared/entity/lesson';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { filterLessonsWithOpenings } from '../../shared/chessTree';
import { partition } from '../../shared/utils';
import SelectTrapsPaneControls from './SelectTrapsPaneControls';

interface Props {
  height: number;
  selectedTraps: Lesson[];
  setSelectedTraps: Dispatch<SetStateAction<Lesson[]>>;
  userColor: PieceColor;
  setUserColor: Dispatch<SetStateAction<PieceColor>>;
}

const SelectTrapsPane: React.FC<Props> = (props) => {
  const [[whiteTraps, blackTraps]] = useState<[Lesson[], Lesson[]]>(
    partition(Object.values(allTraps), (t) => t.playedByWhite),
  );

  const getUserColorTraps = () => (props.userColor === 'white' ? whiteTraps : blackTraps);

  const [listedTraps, setListedTraps] = useState<Lesson[]>(getUserColorTraps());
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening | ''>('');

  const openingsTextFieldRef = useRef<HTMLInputElement | null>(null);

  const filterTraps = (traps: Lesson[]): Lesson[] => {
    if (selectedOpening === '') {
      return traps;
    } else {
      return filterLessonsWithOpenings([selectedOpening], traps);
    }
  };

  const unsetSelectedOpening = () => {
    if (openingsTextFieldRef.current != null) {
      openingsTextFieldRef.current.value = '';
    }
    setSelectedOpening('');
  };

  useEffect(() => {
    setListedTraps(filterTraps(getUserColorTraps()));
    if (selectedOpening !== '') {
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

  const handleSelectedOpeningChange = (opening: string) => {
    if (opening === '') {
      setSelectedOpening(opening);
    } else if (Object.values(ChessOpening).includes(opening as ChessOpening)) {
      setSelectedOpening(opening as ChessOpening);
    } else {
      throw new Error(`Unrecognized chess opening: ${opening}`);
    }
  };

  return (
    <ScrollablePane
      title='Traps'
      height={props.height}
      subheadingComponent={
        <SelectTrapsPaneControls
          userColor={props.userColor}
          setUserColor={props.setUserColor}
          selectedOpening={selectedOpening}
          changeSelectedOpening={handleSelectedOpeningChange}
          numSelectedTraps={props.selectedTraps.length}
          deselectAll={() => props.setSelectedTraps([])}
          selectAll={() => props.setSelectedTraps(listedTraps)}
          openingsTextFieldRef={openingsTextFieldRef}
        />
      }
    >
      <TrapsSelector
        traps={listedTraps}
        selectedTraps={props.selectedTraps}
        setSelectedTraps={props.setSelectedTraps}
        clearFilters={unsetSelectedOpening}
      />
    </ScrollablePane>
  );
};

export default SelectTrapsPane;
