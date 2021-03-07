import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';
import { Trap } from '../../shared/entity/trap';
import ChessLessonPreview from './ChessLessonPreview';
import { viewportHeight, viewportWidth } from '../utils';

const useStyles = makeStyles({
  carousel: {
    width: '100vw',
    maxWidth: '800px',
    margin: '0 auto',
    // Prevent the carouselWrapper div from collapsing when the carousel
    // doesn't have any items in it.
    height: (p: { filledCarouselHeight: number | undefined }) => {
      if (p.filledCarouselHeight != undefined) {
        return p.filledCarouselHeight;
      } else {
        return 'auto';
      }
    },
  },
  chessLessonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
});

interface Props extends React.HTMLProps<HTMLDivElement> {
  traps: Trap[];
  animatedTrap: string | null;
  setAnimatedTrap: (shortName: string) => void;
  stepperValue: number;
  setStepperValue: (newValue: number) => void;
}

const ChessLessonCarousel: React.FC<Props> = (props) => {
  const [filledCarouselHeight, setFilledCarouselHeight] = useState<number | undefined>(
    undefined,
  );

  const classes = useStyles({ filledCarouselHeight });

  // Get the height of the carouselWrapper when it is filled with at least one
  // item. We use the `filledCarouselHeight` to prevent the carouselWrapper div
  // from collapsing when the Carousel doesn't have any items in it.
  // prettier-ignore
  const carouselWrapperRef = useCallback((node) => {
    if (
      filledCarouselHeight == undefined &&
      node != null &&
      props.traps.length > 0
    ) {
      setFilledCarouselHeight(node.getBoundingClientRect().height);
    }
  }, [filledCarouselHeight, props.traps]);

  const calcCardWidth = (): number => {
    const vpWidth = viewportWidth();
    const vpHeight = viewportHeight();
    if (vpHeight < vpWidth) {
      return vpHeight * 0.661;
    } else {
      return vpWidth * 0.911;
    }
  };

  const handleCarouselChange = (idx: number) => {
    if (props.traps.length > 0) {
      props.setAnimatedTrap(props.traps[idx].shortName);
      props.setStepperValue(-1);
    }
  };

  return (
    <div className={props.className} ref={carouselWrapperRef}>
      <Carousel
        className={classes.carousel}
        autoPlay={false}
        navButtonsAlwaysVisible={props.traps.length > 0}
        navButtonsAlwaysInvisible={props.traps.length < 1}
        changeOnFirstRender
        onChange={handleCarouselChange}
        fullHeightHover={false}
        indicatorContainerProps={{
          className: '',
          style: {
            marginTop: '0px',
          },
        }}
      >
        {props.traps.map((trap) => (
          <div key={trap.shortName} className={classes.chessLessonContainer}>
            <ChessLessonPreview
              trap={trap}
              cardWidth={calcCardWidth()}
              stepper={props.animatedTrap === trap.shortName ? props.stepperValue : -1}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ChessLessonCarousel;
