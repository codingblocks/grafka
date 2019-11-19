import React from "react";
import Messages from "./Messages";
import Settings from "../../settings/Settings";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Metadata from "./Metadata";

export default function Home({
  match: {
    params: { clusterId, topic }
  }
}) {
  const { loading, error, data } = useQuery(TOPIC_QUERY, {
    variables: { clusterId, topic }
  });
  const getMetaData = () => {
    if (
      !loading &&
      !error &&
      data.clusters.length === 1 &&
      data.clusters[0].topicListings.length === 1
    ) {
      const clusterName = data.clusters[0].name;
      const topicData = data.clusters[0].topicListings[0];
      return <Metadata clusterName={clusterName} topicData={topicData} />;
    }
    return <span>Loading metadata</span>;
  };

  return (
    <React.Fragment>
      <h1>
        <Settings.icons.Topics /> {topic}
      </h1>

      <h2>Metadata</h2>
      {getMetaData()}

      <h2>Messages</h2>
      <Messages clusterId={clusterId} topic={topic} />

    </React.Fragment>
  );
}

const TOPIC_QUERY = gql`
  query($clusterId: ID!, $topic: String!) {
    clusters(clusterId: $clusterId) {
      name
      topicListings(partialTopicName: $topic) {
        name
        internal
        consumerGroups {
          groupId
          simpleConsumerGroup
          offsets {
            partition
            leaderEpoch
            metadata
            offset
          }
        }
        configs {
          resource {
            name
            default
            type
          }
          config {
            default
            readOnly
            sensitive
            name
            source
            synonyms {
              name
              value
              source
            }
            value
          }
        }
        description {
          authorizedOperations {
            code
            unknown
          }
          partitions {
            partition
            leader {
              id
              host
              port
              rack
            }
            replicas {
              id
              host
              port
              rack
            }
            isr {
              id
              host
              port
              rack
            }
          }
        }
      }
    }
  }
`;
