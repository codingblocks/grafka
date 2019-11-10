import React from "react";
import Messages from './Messages'
import Settings from "../../settings/Settings";

export default function Home({ match: { params: {clusterId, topic} }} ) {
  return <React.Fragment>
    <h1><Settings.icons.Topics /> {topic}</h1>
    <h2>Messages</h2>
    <Messages clusterId={clusterId} topic={topic} />
  </React.Fragment>
};
