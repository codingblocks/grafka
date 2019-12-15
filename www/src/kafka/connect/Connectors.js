import React from "react";
import MaterialTable from "material-table";
import tableIcons from "../../settings/TableIcons";
import { Paper, makeStyles, Link } from "@material-ui/core";
import Settings from "../../settings/Settings";

const useStyles = makeStyles({
  paddedTable: {
    padding: "20px"
  },
  wide: {
    width: "100%"
  }
});

const emoji = state => {
  switch(state) {
    case "RUNNING": return "🏃";
    case "STOPPED": return "🛑";
    case "PAUSED": return "✋";
    default: return "❓";
  }
};

export default function Grid({ results }) {
  const classes = useStyles();
  const formattedResults = results.map(c => {
      if(c.config) {
        try {
          c.parsedConfig = JSON.parse(c.config);
          c.className = c.parsedConfig.config["connector.class"];
          c.topics = c.parsedConfig.config["topic"].split(",");
        } catch(e) {
          console.log(`Error parsing config: ${c}`);
          c.className = "PARSE FAILURE";
          c.topics = "PARSE FAILURE";
        }
      } else {
        c.className = "Missing config";
        c.topics = "Missing config";
      }
      return c
  });

  return (
    <React.Fragment>
      <MaterialTable
        icons={tableIcons}
        title="Connectors"
        components={{
          Container: props => (
            <Paper
              className={classes.paddedTable}
              elevation={Settings.elevation}
              {...props}
            />
          )
        }}
        data={formattedResults}
        columns={[
          {
            title: "Name",
            field: "name",
            render: v => `${emoji(v.status.connector.state)} ${v.name}`
          },
          {
            title: "Type",
            field: "status",
            render: v => v.status.type
          },
          {
            title: "Tasks",
            field: "status",
            render: v => {
              if(!v.status.tasks) {
                return "N/A";
              }
              return v.status.tasks.map(
                t => `${emoji(t.state)} ${t.workerId} ${t.trace || ""}`
              )
            }
          },
          {
            title: "Topics",
            field: "topics"
          },
          {
            title: "Class Name",
            field: "className"
          },
        ]}
      />
    </React.Fragment>
  );
}
