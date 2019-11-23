import React from "react";
import MaterialTable from "material-table";
import tableIcons from "../../settings/TableIcons";
import { Paper, makeStyles } from "@material-ui/core";
import Settings from "../../settings/Settings";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles({
  paddedTable: {
    padding: "20px"
  },
  wide: {
    width: "100%"
  }
});

export default function Grid({ results }) {
  const classes = useStyles();
  // ugh, hate mutating args...
  results.forEach(r => {
    if(r.configs && r.configs.config) {
      r.configs.config.forEach(c => r[c.name] = c.value);
    }

    r.partitionCount = r.offsets.partitionCount;
    r.offsetCount = r.offsets.offsetCount;
    r.lifetimeOffsetCount = r.offsets.lifetimeOffsetCount;
  });
  return (
    <React.Fragment>
      <MaterialTable
        icons={tableIcons}
        title="Topics"
        components={{
          Container: props => (
            <Paper
              className={classes.paddedTable}
              elevation={Settings.elevation}
              {...props}
            />
          )
        }}
        columns={[
          {
            title: "Name",
            field: "name",
            render: v => (
              <Link href={`/kafka/${v.clusterId}/${v.name}`}>{v.name}</Link>
            )
          },
          {
            title: "Partitions",
            field: "partitionCount"
          },
          {
            title: "Current Offsets",
            field: "offsetCount"
          },
          {
            title: "Lifetime Offsets",
            field: "lifetimeOffsetCount"
          },
          {
            title: "Cleanup Policy",
            field: "cleanup.policy"
          },
          {
            title: "Replicas",
            field: "min.insync.replicas"
          },
          {
            title: "Retention",
            field: "retention.ms",
            render: v => {
                if(v["retention.ms"] === "-1") {
                  return "Infinite";
                }
                return `${v["retention.ms"]}ms (${v["retention.ms"] / (1000 * 60 * 60 * 24)} days)`;
              }
          },
          {
            title: "Retention Bytes",
            field: "retention.bytes",
            render: v => {
              if(v["retention.bytes"] === "-1") {
                return "Infinite";
              }
              return `${v["retention.bytes"]}B (${v["retention.ms"] / (1024)}MB)`;
            }
          },
          {
            title: "Internal",
            field: "internal",
            render: v => (v.interal ? "Yes" : "No")
          }
        ]}
        data={results}
      />
    </React.Fragment>
  );
}
