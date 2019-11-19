import React from "react";
import {
  AppBar,
  Box,
  Card,
  Container,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import Messages from "./Messages";

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

export default function Home({ clusterName, topicData }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const authorizedOperations = topicData.description.authorizedOperations
    .map(ao => (ao.unknown ? `${ao.code} (unknown)` : ao.code))
    .join(", ");

  const partitions = topicData.description.partitions
    .map(p => {
      return {
        partition: p.partition,
        display: `P${p.partition} Leader: ${p.leader.id} ${p.leader.host}:${p.leader.port} Rack: ${p.leader.rack} Replicas: ${p.replicas.length} ISR: ${p.isr.length}`
      };
    })
    .sort(p => p.partition)
    .map(p => <ul key={p.partition}>{p.display}</ul>);

  // TODO source for sorting?
  const configs = topicData.configs.config
    .map(c => {
      let result = `${c.name}: ${c.value}`;
      if (c.readOnly) {
        result += " (read only)";
      }
      if (c.sensitive) {
        result += " (sensitive)";
      }
      if (!c.default) {
        result += " (not default!)";
      }
      if (c.synonyms.length) {
        result +=
          ` synonyms: ` +
          c.synonyms.map(s => `${s.name}:${s.value}`).join(", ");
      }
      return { source: c.source, key: c.name, value: result };
    })
    .sort(c => c.source + "-" + c.key)
    .map(c => <li key={c.key}>{c.value}</li>);

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
          <Tab label="Schema" {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <Box>
        <TabPanel value={value} index={0}>
          <p>Internal: {topicData.internal ? "Yes" : "No"}</p>
          <p>Cluster: {clusterName}</p>
          <p>Partitions: {partitions.length}</p>
          <p>Consumer Groups: {topicData.consumerGroups.length}</p>
          <p>Authorized Operations: {authorizedOperations}</p>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {partitions}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {configs}
        </TabPanel>
        <TabPanel value={value} index={3}>
          TODO
        </TabPanel>
        <TabPanel value={value} index={4}>
          TODO
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Messages clusterId={topicData.clusterId} topic={topicData.name} />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <p>TODO</p>
          <ul>
            <li>Offsets?</li>
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
