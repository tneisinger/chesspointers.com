import React, { useRef, useEffect, useCallback, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const ROUGH_APP_BAR_HEIGHT = 40; // pixels

// Prevent the `scrollToBottom()` function from doing anything for this many ms
const SCROLL_TO_BOTTOM_DELAY = 5000;

interface Props {
  height: number;
  title: string;
  subheadingComponent?: React.ReactNode;
  autoScrollDownWhenContentAdded?: boolean;
}

interface StyleProps extends Props {
  appBarHeight: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: '16rem',
    height: (props: StyleProps) => props.height - props.appBarHeight + 'px',
    marginBottom: (props: StyleProps) => props.appBarHeight + 'px',
  },
  appBar: {
    zIndex: 10,
    position: 'relative',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.3)',
  },
  titleText: {
    textAlign: 'center',
    paddingTop: '0.65rem',
    paddingBottom: '0.5rem',
  },
  paneContent: {
    border: '1px solid #555',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
  subheadingContent: {
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.3)',
    padding: '8px 12px 12px 12px',
    backgroundColor: 'rgba(72, 72, 72, 1)',
    zIndex: 0,
  },
  scrollContent: {
    overflowX: 'hidden',
    overflowY: 'overlay' as any,
    flex: 1,
    backgroundColor: (p: StyleProps) =>
      p.subheadingComponent == undefined
        ? theme.palette.background.paper
        : 'rgba(58, 58, 58, 1)',
  },
}));

const ScrollablePane: React.FC<Props> = (props) => {
  const [appBarHeight, setAppBarHeight] = useState(ROUGH_APP_BAR_HEIGHT);

  const classes = useStyles({
    ...props,
    appBarHeight,
  });

  // When the ChessGround board renders for the first time, it seems to temporarily create
  // some undetectable elements that are very large, causing the scrollable width and
  // height of ui to be very large.  Because of this, if `scrollToBottom()` is run while
  // ChessGround is setting up, the browser will scroll far down unnecessarily. To avoid
  // this, we prevent `scrollToBottom()` from doing anything until after
  const [allowScrollToBottom, setAllowScrollToBottom] = useState(false);
  const scrollToBottomTimeout = useRef<number | undefined>(
    window.setTimeout(() => setAllowScrollToBottom(true), SCROLL_TO_BOTTOM_DELAY),
  );

  const scrollToBottom = () => {
    if (!allowScrollToBottom) return;
    const div = scrollToBottomDiv.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const appBarRef = useCallback((appBar) => {
    if (appBar != null) setAppBarHeight(appBar.clientHeight);
  }, []);

  // Get a reference to the div at the bottom of the scrollable content
  const scrollToBottomDiv = useRef<HTMLDivElement | null>(null);

  // Every time this component rerenders, make sure that we scroll to the bottom
  useEffect(() => {
    if (props.autoScrollDownWhenContentAdded) scrollToBottom();
    return () => window.clearTimeout(scrollToBottomTimeout.current);
  });

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} ref={appBarRef}>
        <Typography variant='button' className={classes.titleText}>
          {props.title}
        </Typography>
      </AppBar>
      <Box className={classes.paneContent}>
        {props.subheadingComponent != undefined && (
          <>
            <Box className={classes.subheadingContent}>{props.subheadingComponent}</Box>
          </>
        )}
        <Box className={classes.scrollContent}>
          {props.children}
          <div ref={scrollToBottomDiv}></div>
        </Box>
      </Box>
    </div>
  );
};

export default ScrollablePane;
