import React from "react";
import Settings from "../../settings/Settings";
import { useQuery } from "@apollo/react-hooks";
import Details from "./Details";
import QuerySamples from "./QuerySamples";

export default function Home({
  match: {
    params: { connectId, selectedTab }
  }
}) {

  const { loading, error, data } = useQuery(query, {
    variables: { connectId }
  });
  const storageKey = `connect-details-${connectId}`;
  let displayData = data;
  let hasResults = false;
  if (!loading && !error && displayData) {
    hasResults = true;
    window.localStorage.setItem(storageKey, JSON.stringify(displayData)); // TODO make consistent with other caching
  } else if (loading && !error) {
    try {
      const cachedData = window.localStorage.getItem(storageKey);
      if (cachedData) {
        displayData = JSON.parse(cachedData); // TODO make consistent with other caching
        hasResults = true;
      }
    } catch (e) {
      console.log(`Unable to parse local storage, giving up`);
      window.localStorage.removeItem(storageKey);
    }
  }
  const connectName = loading && !error ? displayData.name : "loading";
  const getMetaData = () => {
    // TODO Gross!
    const displayMetadata =
      hasResults && !error && displayData.connect.length === 1;

    if (displayMetadata) {
      return (
        <Details
          connectId={connectId}
          connectData={displayData.connect}
          selectedTab={selectedTab}
        />
      );
    }
    return <span>Loading connect details</span>;
  };

  return (
    <React.Fragment>
      <h1>
        <Settings.icons.Connect /> {connectName}
      </h1>

      {getMetaData()}

      <QuerySamples />
    </React.Fragment>
  );
}
