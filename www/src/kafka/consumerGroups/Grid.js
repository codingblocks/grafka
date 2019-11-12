import React, { useState } from "react";
import MaterialTable from "material-table";
import tableIcons from "../../settings/TableIcons";
import CachedGraphQLRequester from "../../GraphQL";
import { Paper, makeStyles, Link } from "@material-ui/core";
import Settings from "../../settings/Settings";
import Toast from "../../Toast";

const useStyles = makeStyles({
  paddedTable: {
    padding: "20px"
  },
  wide: {
    width: "100%"
  }
});

export default function Grid({ results, dataChangeHandler }) {
  const defaultToast = { message: "", open: false, closeHandler: () => {} };
  const [toast, setToast] = useState(defaultToast);

  const onAction = (query, variables) =>
    new Promise((resolve, reject) => {
      const graphql = CachedGraphQLRequester({
        query,
        variables,
        success: () => {
          dataChangeHandler();
          resolve();
        },
        failure: message => {
          setToast({
            message: "Error: " + message,
            open: true,
            closeHandler: () => setToast(defaultToast)
          });
          reject();
        }
      });
      graphql.mutate();
    });

  const classes = useStyles();
  return (
    <React.Fragment>
      <MaterialTable
        icons={tableIcons}
        title="Consumer Groups"
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
          { title: "Group Id", field: "groupId", render: v => v.groupId ? v.groupId : "<No Name>" },
          { title: "Simple", field: "simpleConsumerGroup", render: v => v.simpleConsumerGroup ? "Yes" : "No" },
          {
            title: "Offsets", field: "offsets", render: v => {
              const topics = Array
                .from(new Set(v.offsets.map(o => o.topicName)))
                .sort()
                .map(t => <Link href={`/kafka/${v.clusterId}/topic/${t}`}>{t}</Link>);
              return topics.map((t, i) => <React.Fragment>{t}{i === topics.length - 1 ? "" : ", "}</React.Fragment>)
            }
          }
        ]}
        data={results}
        editable={{
          onRowDelete: oldData =>
            onAction(`mutation { deleteCluster(clusterId:"${oldData.clusterId}") }`)
        }}
      />
      <Toast
        message={toast.message}
        open={toast.open}
        closeHandler={toast.closeHandler}
      />
    </React.Fragment>
  );
}