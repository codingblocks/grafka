import React from "react";
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

      {getMetaData()}

    </React.Fragment>
  );
}

const TOPIC_QUERY = gql`
  query($clusterId: ID!, $topic: String!) {
    clusters(clusterId: $clusterId) {
      name
      topicListings(partialTopicName: $topic) {
        clusterId
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
          resource {
            name
            default
            type
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
        offsets {
          partitionCount
          offsetCount
          lifetimeOffsetCount
          minOffset
          maxOffset
        }
      }
    }
  }
`;
