import React, { useRef, useEffect, useCallback, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const ROUGH_APP_BAR_HEIGHT = 40; // pixels

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: '16rem',
    height: (props: Props) => props.height,
  },
  titleText: {
    textAlign: 'center',
    padding: '1rem',
  },
  paneContent: {
    border: '1px solid #555',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    overflowY: 'overlay' as any,
    height: '100%'
  }
}));

interface Props {
  height: number;
  title: string;
  autoScrollDownWhenContentAdded?: boolean;
}

const ScrollablePane: React.FC<Props> = (props) => {
  const classes = useStyles(props);
  const [appBarHeight, setAppBarHeight] = useState(ROUGH_APP_BAR_HEIGHT);

  const appBarRef = useCallback(appBar => {
    if (appBar != null) setAppBarHeight(appBar.clientHeight);
  }, []);

  // Get a reference to the div at the bottom of the scrollable content
  const scrollToBottomDiv = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const div = scrollToBottomDiv.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Every time this component rerenders, make sure that we scroll to the bottom
  useEffect(() => {
    if (props.autoScrollDownWhenContentAdded) scrollToBottom();
  });

  return (
    <div
      className={classes.root}
      style={{ height: (props.height - appBarHeight) + 'px' }}
    >
      <AppBar ref={appBarRef} position="static">
        <Typography variant="button" className={classes.titleText}>
          {props.title}
        </Typography>
      </AppBar>
      <Box className={classes.paneContent}>
        {props.children}
        <div ref={scrollToBottomDiv}></div>
      </Box>
    </div>
  );
}

export default ScrollablePane;
