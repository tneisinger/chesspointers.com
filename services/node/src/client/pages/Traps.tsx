import React from 'react';
import Lessons from './Lessons';
import { getTrapsThunk } from '../redux/trapsSlice';
import { RootState } from '../redux/store';

const TrapsPage: React.FC = () => {
  return (
    <Lessons
      reduxThunk={getTrapsThunk}
      reduxSelector={(state: RootState) => state.trapsSlice}
      pageTitle='Traps'
    />
  );
};

export default TrapsPage;
