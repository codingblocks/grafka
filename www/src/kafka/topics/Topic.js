import React from "react";
import Settings from "../../settings/Settings";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Metadata from "./Metadata";

export default function Home({
  match: {
    params: { clusterId, topic, selectedTab }
  }
}) {
  const { loading, error, data } = useQuery(topicQuery, {
    variables: { clusterId, topic }
  });

  const storageKey = `topic-details-${clusterId}-${topic}`;
  let displayData = data;
  let hasResults = false;
  if(!loading && !error && displayData) {
    hasResults = true;
    window.localStorage.setItem(storageKey, JSON.stringify(displayData)); // TODO make consistent with other caching
  } else if(loading && !error) {
    try {
      const cachedData = window.localStorage.getItem(storageKey);
      if(cachedData) {
        displayData = JSON.parse(cachedData); // TODO make consistent with other caching
        hasResults = true;
      }
    } catch(e) {
      console.log(`Unable to parse local storage, giving up`);
      window.localStorage.removeItem(storageKey);
    }
  }

  const getMetaData = () => {
    // TODO Gross!
    const displayMetadata =
      hasResults &&
      !error &&
      displayData.clusters.length === 1 &&
      displayData.clusters[0].topicListings.length === 1;

    if (displayMetadata) {
      const clusterName = displayData.clusters[0].name;
      const topicData = displayData.clusters[0].topicListings[0];
      return <Metadata clusterName={clusterName} topicData={topicData} selectedTab={selectedTab}/>;
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

const topicQuery = gql`
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
        schema {
          subject
          metadata {
            id
            version
            id
          }
          compatibilityMode
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
          partitionOffsets {
            partition
            beginningOffset
            endOffset
            offsetCount
          }
        }
      }
    }
  }
`;
