import React, { useState, useEffect } from 'react';
import SettingsModalComponent from '../components/SettingsModal';
import { ChessGuideSettings } from '../utils/types';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import { OpMovesPlayedBy } from '../utils/types';
import { isValueOf } from '../../shared/utils';

const LCL_STOR_SETTINGS_KEY = 'settings';

type SettingsToolkit = {
  settings: ChessGuideSettings;
  SettingsModal: React.FC;
  SettingsBtn: React.FC;
};

const defaultSettings: ChessGuideSettings = {
  prac_opMovesPlayedBy: OpMovesPlayedBy.userIfMultipleChoices,
};

const getSettingsFromLocalStorage = (): ChessGuideSettings | null => {
  const localStorageVal = localStorage.getItem(LCL_STOR_SETTINGS_KEY);
  if (localStorageVal == null) return null;
  const maybeSettings = JSON.parse(localStorageVal);
  if (areSettingsValid(maybeSettings)) {
    return maybeSettings;
  }
  return null;
};

// NOTE: This function will need to be updated any time there is a significant change to
// the ChessGuideSettings type. Not sure how else to do this. It seems like it would be
// difficult to generalize this function so that it is agnostic to the exact details of
// the ChessGuideSettings type.
const areSettingsValid = (s: any): s is ChessGuideSettings => {
  if (s == undefined) return false;
  if (s.prac_opMovesPlayedBy == undefined) return false;
  if (!isValueOf(OpMovesPlayedBy, s.prac_opMovesPlayedBy)) {
    return false;
  }
  return true;
};

export function useChessGuideSettings(): SettingsToolkit {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<ChessGuideSettings>(() => {
    const localStorageSettings = getSettingsFromLocalStorage();
    console.log('localStorageSettings:', localStorageSettings);
    if (localStorageSettings == null) return defaultSettings;
    return localStorageSettings;
  });

  useEffect(() => {
    localStorage.setItem(LCL_STOR_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const SettingsModal = () => {
    return (
      <SettingsModalComponent
        isModalOpenOrOpening={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        settings={settings}
        changeSettings={setSettings}
        maxWidth='98vw'
      />
    );
  };

  const SettingsBtn = () => {
    return (
      <IconButton size='small' aria-label='settings' onClick={() => setIsModalOpen(true)}>
        <SettingsIcon />
      </IconButton>
    );
  };

  return {
    settings,
    SettingsModal,
    SettingsBtn,
  };
}
