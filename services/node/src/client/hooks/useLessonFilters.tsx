import React, { useState, useEffect, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import ColorSwitchWithCheckbox from '../components/ColorSwitchWithCheckbox';
import BaseColorSwitch from '../components/ColorSwitch';
import ChessOpeningsDropDown from '../components/ChessOpeningsDropDown';
import { PieceColor, ChessOpening } from '../../shared/chessTypes';
import { Lesson } from '../../shared/entity/lesson';
import { filterLessonsWithOpenings } from '../../shared/chessTree';

const INIT_VAL_SELECTED_COLOR = 'white';
const INIT_VAL_IS_COLOR_FILTER_ENABLED = false;
const INIT_VAL_SELECTED_OPENING = '';

// This is paramater that should be passed to the `useLessonFilters` hook
type Args = {
  unfilteredLessons: Lesson[];
  changeFilteredLessons: (newFilteredLessons: Lesson[]) => void;
  onFiltersChange: (filteredLessons: Lesson[]) => void;
  includeCheckboxInColorSwitch?: boolean;
};

// This is what gets returned by the `useLessonFilters` hook
export type FiltersToolkit = {
  selectedColor: PieceColor | null;
  selectedOpening: ChessOpening | null;
  areAnyFiltersEnabled: () => boolean;
  clearFilters: () => void;
  ColorSwitch: React.FC;
  OpeningsDropDown: React.FC;
  ClearFiltersIconBtn: React.FC;
};

export default function useLessonFilters({
  unfilteredLessons,
  changeFilteredLessons,
  onFiltersChange,
  includeCheckboxInColorSwitch = true,
}: Args): FiltersToolkit {
  const [selectedColor, setSelectedColor] = useState<PieceColor>(INIT_VAL_SELECTED_COLOR);
  const [isColorFilterEnabled, setIsColorFilterEnabled] = useState(
    INIT_VAL_IS_COLOR_FILTER_ENABLED,
  );
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening | ''>(
    INIT_VAL_SELECTED_OPENING,
  );

  const hasSelectedColorChanged = useRef<boolean>();
  const hasIsColorFilterEnabledChanged = useRef<boolean>();
  const hasSelectedOpeningChanged = useRef<boolean>();

  const filterLessons = (): Lesson[] => {
    let filteredLessons = unfilteredLessons;
    if (isColorFilterEnabled) {
      filteredLessons = filteredLessons.filter(
        (lesson) => lesson.playedByWhite === (selectedColor === 'white'),
      );
    }
    if (selectedOpening !== '') {
      filteredLessons = filterLessonsWithOpenings([selectedOpening], filteredLessons);
    }
    changeFilteredLessons(filteredLessons);
    return filteredLessons;
  };

  const areAnyFiltersEnabled = (): boolean => {
    return isColorFilterEnabled || selectedOpening !== '';
  };

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

  const ClearFiltersIconBtn = () => (
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

  useEffect(() => {
    if (isColorFilterEnabled !== INIT_VAL_IS_COLOR_FILTER_ENABLED) {
      hasIsColorFilterEnabledChanged.current = true;
    }
  }, [isColorFilterEnabled]);

  useEffect(() => {
    if (selectedColor !== INIT_VAL_SELECTED_COLOR) {
      hasSelectedColorChanged.current = true;
    }
  }, [selectedColor]);

  useEffect(() => {
    if (selectedOpening !== INIT_VAL_SELECTED_OPENING) {
      hasSelectedOpeningChanged.current = true;
    }
  }, [selectedOpening]);

  // Whenever any filter option changes...
  useEffect(() => {
    // We don't want to trigger a filter change immediately after page load,
    // so make sure that at least one of them has changed from its initial value.
    if (
      hasIsColorFilterEnabledChanged.current ||
      hasSelectedOpeningChanged.current ||
      hasSelectedOpeningChanged.current
    ) {
      onFiltersChange(filterLessons());
    }
  }, [isColorFilterEnabled, selectedColor, selectedOpening]);

  // Whenever the unfilteredLessons change, we need to rerun the filter to make sure
  // that any new lessons show up in the filtered list of lessons.
  useEffect(() => {
    filterLessons();
  }, [unfilteredLessons]);

  return {
    selectedColor: isColorFilterEnabled ? selectedColor : null,
    selectedOpening: selectedOpening === '' ? null : selectedOpening,
    areAnyFiltersEnabled,
    clearFilters,
    ColorSwitch,
    OpeningsDropDown,
    ClearFiltersIconBtn,
  };
}
