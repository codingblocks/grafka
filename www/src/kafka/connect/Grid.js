import React, { useState } from "react";
import MaterialTable from "material-table";
import tableIcons from "../../settings/TableIcons";
import CachedGraphQLRequester from "../../GraphQL";
import { Paper, makeStyles, TextareaAutosize, Link } from "@material-ui/core";
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
        title="Connect Configurations"
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
          { title: "Name", field: "name" },
          { title: "ConnectId", field: "connectId", editComponent: _ => null },
          {
            title: "Config",
            field: "config",
            render: () => "...",
            editComponent: props => (
              <TextareaAutosize
                value={props.value}
                className={classes.wide}
                onChange={e => props.onChange(e.target.value)}
              />
            )
          },
          {
            title: "Plugins",
            field: "plugins",
            render: v => v.plugins.length,
            editComponent: _ => null
          },
          {
            title: "Connectors",
            field: "connectors",
            render: v => `${v.connectors.length} (${v.connectors.filter(c => c.state === "RUNNING").length} running`,
            editComponent: _ => null
          }
        ]}
        data={results}
        editable={{
          onRowDelete: oldData =>
            onAction(`mutation { deleteConnect(connectId:"${oldData.connectId}") }`),
          onRowUpdate: newData =>
            onAction(
              `mutation($connectId: String!, $name: String!, $config: String!) { updateConnect(connectId: $connectId, name: $name, config: $config) { connectId name config }}`,
              newData
            ),
          onRowAdd: newData =>
            onAction(
              `mutation($name: String!, $config: String!) { newConnect(name: $name, config: $config) { connectId name config }}`,
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