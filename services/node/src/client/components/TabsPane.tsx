import React, { ReactElement } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #555',
    borderTop: 'none',
    borderRadius: '4px',
    height: '100%',
  },
  lonelyTab: {
    textAlign: 'center',
    padding: '1rem',
  },
  tabContent: {
    display: 'table',
    tableLayout: 'fixed',
    width: '100%',
  }
}));

type TabData = {
  name: string,
  content: ReactElement,
}

interface Props {
  tabs: TabData[];
}

const TabsPane: React.FC<Props> = ({ tabs }) => {
  const classes = useStyles();
  const [selectedTabIdx, setSelectedTabIdx] = React.useState(0);

  const handleChange = (_event: React.ChangeEvent<{}>, newTabIdx: number) => {
    setSelectedTabIdx(newTabIdx);
  };

  if (tabs.length < 1) {
    throw new Error('At least one TabData must be provided');
  }

  if (tabs.length === 1) {
    const { name, content } = tabs[0];
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Typography variant="button" className={classes.lonelyTab}>
            {name}
          </Typography>
        </AppBar>
        <Box>
          {content}
        </Box>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
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
