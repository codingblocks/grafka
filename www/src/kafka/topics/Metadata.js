import React from "react";
import { AppBar, Box, Card, Tab, Tabs, Typography } from "@material-ui/core";
import Messages from "./messages/Messages";
import Configs from "./Configs";
import BasicDetails from "./BasicDetails";
import Partitions from "./Partitions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default function Home({ clusterName, topicData, selectedTab }) {
  const tabs = "details,partitions,configs,consumer-groups,schema,messages,coming-soon"
    .split(",")
    .reduce((hash, tab, index) => {
      hash[tab] = index;
      return hash;
    }, {});

  const initialValue = selectedTab && tabs[selectedTab] ? tabs[selectedTab] : 0;
  const [value, setValue] = React.useState(initialValue);
  const handleChange = (event, newValue) => {
    // TODO Update browser history to change the url?
    setValue(newValue);
  };

  const partitions = topicData.description.partitions.sort((a, b) =>
    a.partition > b.partition ? 1 : -1
  );
  topicData.offsets.partitionOffsets.forEach(p => {
    Object.assign(partitions[p.partition], p);
  });

  return (
    <Card>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Basic" {...a11yProps(0)} />
          <Tab label="Partitions" {...a11yProps(1)} />
          <Tab label="Configs" {...a11yProps(2)} />
          <Tab label="Consumer Groups" {...a11yProps(3)} />
          <Tab label="Schema" {...a11yProps(4)} />
          <Tab label="Messages" {...a11yProps(5)} />
          <Tab label="Coming soon" {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <Box>
        <TabPanel value={value} index={0}>
          <BasicDetails clusterName={clusterName} topicData={topicData} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Partitions partitions={partitions} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Configs configs={topicData.configs.config} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          Coming soon
        </TabPanel>
        <TabPanel value={value} index={4}>
          Coming soon
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Messages
            clusterId={topicData.clusterId}
            topic={topicData.name}
            schema={topicData.schema}
          />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <p>Coming soon</p>
          <ul>
            <li>Mutations</li>
            <li>Consumer Groups</li>
            <li>Schema</li>
            <li>Postgres data, first / last date seen? Creator?</li>
          </ul>
        </TabPanel>
      </Box>
    </Card>
  );
}
