import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Modal, { Props as ModalProps } from './Modal';
import RadioInputGroup from './RadioInputGroup';
import { ChessGuideSettings, OpMovesPlayedBy } from '../utils/types';
import { isValueOf } from '../../shared/utils';

const useStyles = makeStyles({
  modalContent: {
    marginTop: '1rem',
  },
  checkbox: {
    display: 'inline-block',
  },
  settingsOptions: {
    margin: '1.5rem 0',
    '&> *:not(:last-child)': {
      marginBottom: '1.5rem',
    },
  },
  settingsOption: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid gray',
  },
});

interface Props extends ModalProps {
  settings: ChessGuideSettings;
  changeSettings: (newSettings: ChessGuideSettings) => void;
}

const SettingsModal: React.FC<Props> = ({
  settings,
  changeSettings,
  handleClose,
  ...modalProps
}) => {
  const classes = useStyles();

  const [newSettings, setNewSettings] = useState<ChessGuideSettings>(settings);

  const handleModalClose = () => {
    handleClose();
    changeSettings(newSettings);
  };

  return (
    <Modal handleClose={handleModalClose} {...modalProps}>
      <div className={classes.modalContent}>
        <Typography variant='h4'>
          Settings
        </Typography>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <div className={classes.settingsOptions}>
              <div className={classes.settingsOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color='primary'
                      checked={newSettings.allowDeadEndModal}
                      onChange={() => setNewSettings({
                        ...newSettings,
                        allowDeadEndModal: !newSettings.allowDeadEndModal,
                      })}
                    />
                  }
                  label="Show dead end warnings"
                />
              </div>
              <div className={classes.settingsOption}>
                <RadioInputGroup
                  label='In practice mode, opponent moves are played by...'
                  optionTexts={Object.values(OpMovesPlayedBy)}
                  selectedValue={newSettings.prac_opMovesPlayedBy}
                  changeSelectedValue={(newValue: string) => {
                    if (!isValueOf(OpMovesPlayedBy, newValue)) {
                      throw new Error(`Invalid OpMovesPlayedBy value: ${newValue}`);
                    }
                    setNewSettings((s: ChessGuideSettings) => ({
                      ...s,
                      prac_opMovesPlayedBy: newValue,
                    }));
                  }}
                />
              </div>
            </div>
          </Grid>
          <Grid item>
            <Button variant='contained' color='primary' onClick={handleModalClose}>
              Ok
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

export default SettingsModal;
