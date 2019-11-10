import Settings from "./settings/Settings";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*"
};

const defaultData = { results: {}, date: null, loading: true };

export default function({ key, query, variables, setData, success, failure }) {
  return {
    initialData: () => {
      const cachedData = window.localStorage.getItem(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      } else {
        return defaultData;
      }
    },
    refresh: () => {
      const currentData = JSON.parse(window.localStorage.getItem(key)) || defaultData;
      currentData.date =
        currentData && currentData.date
          ? new Date(currentData.date).toLocaleString()
          : "";
      currentData.loading = true;
      setData(currentData);
      fetch(Settings.graphqlUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query, variables })
      })
        .then(r => r.json())
        .then(results => {
          const cachedData = {
            results: results.data,
            date: new Date(),
            loading: false
          };
          window.localStorage.setItem(key, JSON.stringify(cachedData));
          setData(cachedData);
          if (success) {
            success(cachedData);
          }
        })
        .catch(e => {
          if (failure) {
            failure(JSON.stringify(e));
          }
        });
    },
    mutate: () => {
      fetch(Settings.graphqlUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query, variables })
      })
        .then(r => r.json())
        .then(results => {
          if (results.errors) {
            return failure(results.errors.map(e => e.message).join("\n"));
          }
          if (success) {
            return success(results);
          }
        })
        .catch(e => {
          if (failure) {
            return failure(e);
          }
        });
    }
  };
}