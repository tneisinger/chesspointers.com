import React from 'react';
import { makeStyles } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';
import { ChessTrap } from '../../shared/entity/chessTrap';
import ChessLessonPreview from './ChessLessonPreview';
import { viewportHeight, viewportWidth } from '../utils';

const useStyles = makeStyles({
  carousel: {
    width: '100vw',
    maxWidth: '800px',
    margin: '0 auto',
  },
  chessLessonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
});

interface Props extends React.HTMLProps<HTMLDivElement> {
  chessTraps: ChessTrap[];
  animatedTrap: string | null;
  setAnimatedTrap: (shortName: string) => void;
  stepperValue: number;
  setStepperValue: (newValue: number) => void;
}

const ChessLessonCarousel: React.FC<Props> = (props) => {
  const classes = useStyles();

  const calcCardWidth = (): number => {
    const vpWidth = viewportWidth();
    const vpHeight = viewportHeight();
    if (vpHeight < vpWidth) {
      return vpHeight * 0.661;
    } else {
      return vpWidth * 0.911;
    }
  };

  return (
    <Carousel
      className={`${props.className} ${classes.carousel}`}
      autoPlay={false}
      navButtonsAlwaysVisible
      changeOnFirstRender
      onChange={(idx: number) => {
        const trap = props.chessTraps[idx];
        if (trap != undefined) {
          props.setAnimatedTrap(props.chessTraps[idx].shortName);
          props.setStepperValue(-1);
        }
      }}
      fullHeightHover={false}
    >
      {props.chessTraps.map((trap) => (
        <div key={trap.shortName} className={classes.chessLessonContainer}>
          <ChessLessonPreview
            chessTrap={trap}
            cardWidth={calcCardWidth()}
            stepper={props.animatedTrap === trap.shortName ? props.stepperValue : -1}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ChessLessonCarousel;
