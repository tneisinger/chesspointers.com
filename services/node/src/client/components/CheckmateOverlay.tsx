import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const DEFAULT_Z_INDEX = 20;

const useStyles = makeStyles({
  checkmateOverlayRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: (props: Props) => props.width,
    height: (props: Props) => props.height,
    zIndex: (props: Props) => props.zIndex || DEFAULT_Z_INDEX,
    pointerEvents: 'none',
  },
  checkmateDiv: {
    opacity: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '0.5rem',
    margin: '0 auto',
    backgroundColor: `rgb(190, 0, 0, 0.75)`,
    display: 'inline-block',
    textAlign: 'center',
    borderRadius: '8px',
  },
  checkmateVisible: {
    opacity: 1,
    transition: 'opacity 0.35s',
  },
  checkmateText: {
    fontWeight: 500,
  },
});

interface Props {
  inCheckmate: boolean;
  width: string;
  height: string;
  zIndex?: number;
}

const CheckmateOverlay: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const getClasses = (): string => {
    let result = classes.checkmateDiv;
    if (props.inCheckmate) result += ` ${classes.checkmateVisible}`;
    return result;
  };

  return (
    <div className={classes.checkmateOverlayRoot}>
      <div className={getClasses()}>
        <Typography variant='h4' className={classes.checkmateText}>
          Checkmate!
        </Typography>
      </div>
    </div>
  );
};

export default CheckmateOverlay;
