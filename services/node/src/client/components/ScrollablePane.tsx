import React, { useRef, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: '16rem',
  },
  titleText: {
    textAlign: 'center',
    padding: '1rem',
  },
  tabContent: {
    border: '1px solid #555',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    overflowY: 'overlay' as any,
    height: '50vmin',
  }
}));

interface Props {
  height: number;
  title: string;
  autoScrollDownWhenContentAdded?: boolean;
}

const ScrollablePane: React.FC<Props> = ({
  height,
  title,
  autoScrollDownWhenContentAdded = false,
  children,
}) => {
  const classes = useStyles();

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
    if (autoScrollDownWhenContentAdded) scrollToBottom();
  });

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Typography variant="button" className={classes.titleText}>
          {title}
        </Typography>
      </AppBar>
      <Box>
        <Box style={{ height: height + 'px' }} className={classes.tabContent}>
          {children}
          <div ref={scrollToBottomDiv}></div>
        </Box>
      </Box>
    </div>
  );
}

export default ScrollablePane;
