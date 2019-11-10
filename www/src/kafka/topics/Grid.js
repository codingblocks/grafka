import React, { useState } from "react";
import MaterialTable from "material-table";
import tableIcons from "../../settings/TableIcons";
import CachedGraphQLRequester from "../../GraphQL";
import { Paper, makeStyles } from "@material-ui/core";
import Settings from "../../settings/Settings";
import Toast from "../../Toast";
import Link from "@material-ui/core/Link";

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
            title: "Internal",
            field: "internal",
            render: v => (v.interal ? "Yes" : "No")
          }
        ]}
        data={results}
        editable={{
          onRowDelete: oldData =>
            onAction(`mutation { deleteCluster(id:"${oldData.clusterId}") }`),
          onRowAdd: newData =>
            onAction(
              `mutation($name: String!, $config: String!) { newCluster(name: $name, config: $config) { id name config }}`,
              { name: newData.name, config: newData.config }
            )
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