import React, { useState } from 'react';
import useDimensions from 'react-use-dimensions';
import { Theme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core';
import ChessLessonPreview from './ChessLessonPreview';
import { ChessTrap } from '../../shared/entity/chessTrap';
import ChessTrapFilters from '../components/ChessTrapFilters';
import useInterval from 'react-useinterval';
import Carousel from 'react-material-ui-carousel';
import { viewportHeight, viewportWidth } from '../utils';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: 'inline-block',
    margin: '16px',
  },
  cardContent: {
    padding: '24px',
  },
  filtersBar: {
    opacity: 0.95,
    padding: '0.75rem',
    position: 'fixed',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 'auto',
    bottom: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.sideMenuWidth,
      width: `calc(100% - ${theme.sideMenuWidth}px)`,
    },
  },
  chessLessonPreviewsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  chessLessonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  carousel: {
    maxWidth: '800px',
    margin: '0 auto',
    height: '100%',
  },
}));

interface Props {
  chessTraps: ChessTrap[];
  parentWidth: number;
  trapsPerRow: number;
}

const DisplayChessTraps: React.FC<Props> = (props) => {
  const classes = useStyles(props);

  const [filtersBarRef, filtersBarDimensions] = useDimensions();

  const [visibleTraps, setVisibleTraps] = useState<ChessTrap[]>(props.chessTraps);

  const [hoveredTrap, setHoveredTrap] = useState<string | null>(null);

  const [stepper, setStepper] = useState<number>(-1);

  useInterval(() => {
    if (hoveredTrap != null) {
      setStepper(stepper + 1);
    }
  }, 600);

  const calcCardWidth = (): number => {
    const vpWidth = viewportWidth();
    const vpHeight = viewportHeight();
    if (vpHeight < vpWidth) {
      return vpHeight - 325;
    } else {
      return vpWidth - 100;
    }
  };

  return (
    <>
      <AppBar ref={filtersBarRef} className={classes.filtersBar} color='default'>
        <ChessTrapFilters
          allTraps={props.chessTraps}
          setSelectedTraps={setVisibleTraps}
        />
      </AppBar>
      <Carousel
        className={classes.carousel}
        autoPlay={false}
        navButtonsAlwaysVisible
        changeOnFirstRender
        onChange={(idx: number) => {
          setHoveredTrap(visibleTraps[idx].shortName);
          setStepper(-1);
        }}
      >
        {visibleTraps.map((trap) => (
          <div key={trap.shortName} className={classes.chessLessonContainer}>
            <ChessLessonPreview
              chessTrap={trap}
              cardWidth={calcCardWidth()}
              stepper={hoveredTrap === trap.shortName ? stepper : -1}
              onHoverChange={(trapName, isHovered) => {
                // if (trapName !== hoveredTrap) {
                  // setStepper(-1);
                // }
                // if (isHovered) {
                  // setHoveredTrap(trapName);
                // } else {
                  // setHoveredTrap(null);
                // }
              }}
            />
          </div>
        ))}
      </Carousel>
      <div style={{ height: filtersBarDimensions.height }} />
    </>
  );
};

export default DisplayChessTraps;
