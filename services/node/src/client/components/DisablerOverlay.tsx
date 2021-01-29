import React from 'react';
import { makeStyles } from '@material-ui/core';

const DEFAULT_Z_INDEX = 20;
const DEFAULT_OPACITY = 0.3;
const DEFAULT_COLOR = 'gray';

interface Props {
  width: string;
  height: string;
  isDisabling: boolean;
  color?: string;
  opacity?: number;
  zIndex?: number;
}

const useStyles = makeStyles({
  disablerOverlayRoot: {
    opacity: (p: Props) => (p.opacity == undefined ? DEFAULT_OPACITY : p.opacity),
    position: 'absolute',
    top: 0,
    left: 0,
    width: (p: Props) => p.width,
    height: (p: Props) => p.height,
    zIndex: (p: Props) => p.zIndex || DEFAULT_Z_INDEX,
    pointerEvents: (p: Props) => (p.isDisabling ? 'auto' : 'none'),
    backgroundColor: (p: Props) => {
      const color = p.color || DEFAULT_COLOR;
      return p.isDisabling ? color : 'transparent';
    },
  },
});

const DisablerOverlay: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  return <div className={classes.disablerOverlayRoot} />;
};

export default DisablerOverlay;
