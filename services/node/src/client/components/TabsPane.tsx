import React, { ReactElement, useRef, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxWidth: '16rem',
  },
  tabsBar: {
  },
  lonelyTabName: {
    textAlign: 'center',
    padding: '1rem',
  },
  tabContentWrapper: {
  },
  tabContent: {
    border: '1px solid #555',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    overflowY: 'overlay' as any,
    height: '50vmin',
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chessGuide-tabpanel-${index}`}
      aria-labelledby={`chessGuide-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(tabIndex: number) {
  return {
    id: `tab-${tabIndex}`,
    'aria-controls': `tabpanel-${tabIndex}`,
  };
}

type TabData = {
  name: string,
  content: ReactElement,
}

interface Props {
  tabs: TabData[];
  height: number;
}

const TabsPane: React.FC<Props> = ({ tabs, height }) => {
  const classes = useStyles();
  const [selectedTabIdx, setSelectedTabIdx] = React.useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newTabIdx: number) => {
    setSelectedTabIdx(newTabIdx);
  };

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
    scrollToBottom();
  });

  if (tabs.length < 1) {
    throw new Error('At least one TabData must be provided');
  }

  if (tabs.length === 1) {
    const { name, content } = tabs[0];
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.tabsBar}>
          <Typography variant="button" className={classes.lonelyTabName}>
            {name}
          </Typography>
        </AppBar>
        <Box className={classes.tabContentWrapper}>
          <Box style={{ height: height + 'px' }} className={classes.tabContent}>
            {content}
            <div ref={scrollToBottomDiv}></div>
          </Box>
        </Box>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.tabsBar}>
        <Tabs
          value={selectedTabIdx}
          onChange={handleChange}
        >
          {tabs.map((tab, idx) =>
            <Tab
              key={tab.name + idx}
              label={tab.name}
              style={{ width: `${100 / tabs.length}%`, minWidth: 'unset'}}
              {...a11yProps(idx)} />
          )}
        </Tabs>
      </AppBar>
      {tabs.map((tab, idx) =>
        <TabPanel key={tab.name + idx} value={selectedTabIdx} index={idx}>
          <div className={classes.tabContent}>
            {tab.content}
          </div>
        </TabPanel>
      )}
    </div>
  );
}

export default TabsPane;
