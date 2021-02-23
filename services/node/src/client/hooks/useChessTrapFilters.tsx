import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ColorSwitchWithCheckbox from '../components/ColorSwitchWithCheckbox';
import BaseColorSwitch from '../components/ColorSwitch';
import ChessOpeningsDropDown from '../components/ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { ChessTrap } from '../../shared/entity/chessTrap';
import { filterTrapsWithOpenings } from '../../shared/chessTree';

type ReturnValue = {
  selectedColor: PieceColor;
  setSelectedColor: Dispatch<SetStateAction<PieceColor>>;
  isColorFilterEnabled: boolean;
  setIsColorFilterEnabled: Dispatch<SetStateAction<boolean>>;
  selectedOpening: ChessOpening | '';
  setSelectedOpening: Dispatch<SetStateAction<ChessOpening | ''>>;
  areAnyFiltersEnabled: () => boolean;
  clearFilters: () => void;
  ColorSwitch: React.FC;
  OpeningsDropDown: React.FC;
  ClearFiltersBtn: React.FC;
};

type Args = {
  allTraps: ChessTrap[];
  changeFilteredTraps: (newFilteredTraps: ChessTrap[]) => void;
  onFiltersChange: (filteredTraps: ChessTrap[]) => void;
  includeCheckboxInColorSwitch?: boolean;
};

export default function useChessTrapFilters({
  allTraps,
  changeFilteredTraps,
  onFiltersChange,
  includeCheckboxInColorSwitch = true,
}: Args): ReturnValue {
  const [selectedColor, setSelectedColor] = useState<PieceColor>('white');
  const [isColorFilterEnabled, setIsColorFilterEnabled] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening | ''>('');

  const filterTraps = (): ChessTrap[] => {
    let filteredTraps = allTraps;
    if (isColorFilterEnabled) {
      filteredTraps = filteredTraps.filter(
        (trap) => trap.playedByWhite === (selectedColor === 'white'),
      );
    }
    if (selectedOpening !== '') {
      filteredTraps = filterTrapsWithOpenings([selectedOpening], filteredTraps);
    }
    changeFilteredTraps(filteredTraps);
    return filteredTraps;
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

  const ColorSwitch = () => {
    if (includeCheckboxInColorSwitch) {
      return (
        <ColorSwitchWithCheckbox
          isEnabled={isColorFilterEnabled}
          setIsEnabled={setIsColorFilterEnabled}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      );
    } else {
      return (
        <BaseColorSwitch
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          isEnabled={isColorFilterEnabled}
        />
      );
    }
  };

  const ClearFiltersBtn = () => (
    <IconButton onClick={clearFilters} disabled={!areAnyFiltersEnabled()}>
      <ClearIcon />
    </IconButton>
  );

  const OpeningsDropDown = () => (
    <ChessOpeningsDropDown
      selectedOpening={selectedOpening}
      onChange={handleOpeningsDropdownChange}
    />
  );

  // Whenever any filter option changes...
  useEffect(() => {
    onFiltersChange(filterTraps());
  }, [isColorFilterEnabled, selectedColor, selectedOpening]);

  return {
    selectedColor,
    setSelectedColor,
    isColorFilterEnabled,
    setIsColorFilterEnabled,
    selectedOpening,
    setSelectedOpening,
    areAnyFiltersEnabled,
    clearFilters,
    ColorSwitch,
    OpeningsDropDown,
    ClearFiltersBtn,
  };
}
