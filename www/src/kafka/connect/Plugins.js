import React from "react";
import {Grid, Link} from "@material-ui/core";

export default ({ data }) => {
  const splitData = data.reduce((hash, p) => {
    hash[p.type] = hash[p.type] || [];
    hash[p.type].push(p);
    return hash;
  }, {});
  Object.keys(splitData).forEach(k => {
    splitData[k].sort(c => c.className);
  });

  return (
    <React.Fragment>
      <h3>Plugins</h3>

      <Grid container spacing={2}>
        {Object.keys(splitData).map(t => (
          <React.Fragment key={t}>
            <Grid item xs={6}>
              <h4>{t}</h4>
              <ul>
                {splitData[t]
                  .map(p => `${p.className}:${p.version}`)
                  .map(p => (
                    <li key={p}>{p}</li>
                  ))}
              </ul>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <p>Find more connectors: <Link href="https://www.confluent.io/hub/>https://www.confluent.io/hub/">https://www.confluent.io/hub/>https://www.confluent.io/hub/</Link></p>
    </React.Fragment>
  );
};
