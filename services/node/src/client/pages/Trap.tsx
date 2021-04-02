import React from 'react';
import LessonPage from './Lesson';
import { getTrapsThunk } from '../redux/trapsSlice';
import { RootState } from '../redux/store';

const TrapPage: React.FunctionComponent = () => {
  return (
    <LessonPage
      reduxThunk={getTrapsThunk}
      reduxSelector={(state: RootState) => state.trapsSlice}
    />
  );
};

export default TrapPage;
