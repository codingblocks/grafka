import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Settings from "../../settings/Settings";
import Plugins from "./Plugins";
import gql from "graphql-tag";

export default function Details({match: {params: { connectId }}}) {
  const storageKey = `connect-details-${connectId}`;
  let hasResults = false;
  const { loading, error, data } = useQuery(query, {
    variables: { connectId }
  });

  let displayData = data ? data.connect[0] : {};

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

  const connectName = loading ? "Loading" : displayData.name;

  const getDetails = () => {
    // TODO Gross!
    const displayMetadata =
      hasResults &&
      !error;

    if (displayMetadata) {
      return <React.Fragment>

        <h2>Connectors</h2>
        <p>TODO</p>
        <h2>Config</h2>
        <p>{displayData.config}</p>
        <Plugins data={displayData.plugins} />
      </React.Fragment>
    }
    return <span>Loading connect details</span>;
  };

  return (
    <React.Fragment>
      <h1>
        <Settings.icons.Connect /> {connectName}
      </h1>

      {getDetails()}

    </React.Fragment>
  );
}

const query = gql`
  query($connectId: ID!) {
    connect(connectId: $connectId) {
      connectId
      name
      config
      plugins {
        className
        type
        version
      }
      connectors {
        name
        status {
          name
          type
          connector {
            state
          }
          tasks {
            state
          }
        }
      }
    }
  }
`;
