import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Spinner: React.FC = () => {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
      <CircularProgress />
    </div>
  );
};

export default Spinner;
