import React from 'react';
import { makeStyles } from '@material-ui/core';

const Z_INDEX = 10;
const MAX_OPACITY = 0.3;

const useStyles = makeStyles({
  colorFlashOverlayRoot: {
    backgroundColor: (props: Props) => props.color,
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: (props: Props) => props.width,
    height: (props: Props) => props.height,
    zIndex: (props: Props) => props.zIndex || Z_INDEX,
    pointerEvents: 'none',
  },
  flash: {
    animation: `$blink 500ms`,
  },
  "@keyframes blink": {
    '0%': {
      opacity: 0,
    },
    '25%': {
      opacity: MAX_OPACITY,
    },
    '50%': {
      opacity: 0
    },
    '75%': {
      opacity: MAX_OPACITY,
    },
    '100%': {
      opacity: 0
    },
  },
});

interface Props {
  width: string;
  height: string;
  color: string;
  flashIdx: number;
  zIndex?: number;
  flashSpeed?: number;
  flashDuration?: number;
}

const ColorFlashOverlay: React.FC<Props> = (props) => {

  const classes = useStyles(props);

  const makeClasses = () => {
    if (props.flashIdx > 0) {
      return `${classes.colorFlashOverlayRoot} ${classes.flash}`;
    }
    return classes.colorFlashOverlayRoot;
  }

  return <div key={props.flashIdx} className={makeClasses()} />;
}

export default ColorFlashOverlay;
