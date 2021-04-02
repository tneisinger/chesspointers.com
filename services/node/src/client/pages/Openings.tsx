import React from 'react';
import Lessons from './Lessons';
import { getOpeningsThunk } from '../redux/openingsSlice';
import { RootState } from '../redux/store';

const OpeningsPage: React.FC = () => {
  return (
    <Lessons
      reduxThunk={getOpeningsThunk}
      reduxSelector={(state: RootState) => state.openingsSlice}
      pageTitle='Openings'
    />
  );
};

export default OpeningsPage;
