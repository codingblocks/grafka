import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import "typeface-roboto";
import AppBar from "./AppBar";
import Home from "./Home";
import Preferences, { getCurrentTheme } from "./settings/Preferences";
import KafkaClusters from "./kafka/clusters/Home";
import KafkaConnect from "./kafka/connect/Home";
import KafkaConsumerGroups from "./kafka/consumerGroups/Home";
import KafkaTopics from "./kafka/topics/Home";
import KafkaTopic from "./kafka/topics/Topic";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import Console from "./Console";
import Divider from "@material-ui/core/Divider";
import Settings from "./settings/Settings";
import ApolloClient from "apollo-client";
import { ApolloProvider } from '@apollo/react-hooks';
import {HttpLink} from "apollo-link-http";
import { WebSocketLink } from 'apollo-link-ws';
import {split} from "apollo-link";
import {getMainDefinition} from "apollo-utilities";
import {InMemoryCache} from "apollo-cache-inmemory";
import ErrorBoundary from "./settings/ErrorBoundary";

const httpLink = new HttpLink({uri: Settings.graphqlUrl});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: Settings.graphqlWebSocketUrl,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

// Instantiate client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

function App() {
  const [theme, setTheme] = useState(getCurrentTheme());

  return (
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <AppBar />
          <Container maxWidth={false}>
            <CssBaseline />
            <ErrorBoundary>
              <Switch>
                <Route path="/kafka/clusters">
                  <KafkaClusters />
                </Route>
                <Route path="/kafka/:clusterId/consumer-groups" component={KafkaConsumerGroups} />
                <Route path="/kafka/:clusterId/topics" component={KafkaTopics} />
                <Route path="/kafka/:clusterId/:topic/:selectedTab" component={KafkaTopic} />
                <Route path="/kafka/:clusterId/:topic" component={KafkaTopic} />
                <Route path="/kafka/connect">
                  <KafkaConnect />
                </Route>
                <Route path="/preferences">
                  <Preferences
                    themeChangedCallback={() => setTheme(getCurrentTheme())}
                  />
                </Route>
                <Route path="/" component={Home} />
              </Switch>
              <Divider />
              <div style={{ marginTop: "20px" }}>
                <Console />
              </div>
              </ErrorBoundary>
            </Container>
        </BrowserRouter>
      </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
