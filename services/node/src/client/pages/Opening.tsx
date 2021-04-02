import React from 'react';
import LessonPage from './Lesson';
import { getOpeningsThunk } from '../redux/openingsSlice';
import { RootState } from '../redux/store';

const OpeningPage: React.FC = () => {
  return (
    <LessonPage
      reduxThunk={getOpeningsThunk}
      reduxSelector={(state: RootState) => state.openingsSlice}
    />
  );
};

export default OpeningPage;
