import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { getTrapsThunk } from '../redux/trapsSlice';

const RequireTraps: React.FC = (props) => {
  const dispatch = useDispatch();

  const trapsSlice = useSelector((state: RootState) => state.trapsSlice);

  useEffect(() => {
    if (trapsSlice.requestStatus === 'NO_REQUEST_YET') {
      dispatch(getTrapsThunk());
    }
  }, []);

  if (trapsSlice.requestStatus === 'ERROR') {
    return <p>An error occurred: {trapsSlice.error}</p>;
  }

  if (trapsSlice.requestStatus !== 'LOADED') {
    return <p>Loading...</p>;
  }

  const childrenWithSlice = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { traps: trapsSlice.traps });
    }
    return child;
  });

  return <>{childrenWithSlice}</>;
};

export default RequireTraps;
