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
        title="Cluster Configurations"
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
          { title: "ClusterId", field: "clusterId", editComponent: _ => null },
          {
            title: "Controller",
            field: "config",
            render: v => {
              return v.description && v.description.controller
                ? `${v.description.controller.host}:${v.description.controller.port}`
                : "n/a"
            },
            editComponent: _ => null
          },
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
            title: "Nodes",
            field: "config",
            render: v => {
              return v.description.nodes.length
            },
            editComponent: _ => null
          },
          {
            title: "Topics (Internal)",
            field: "totalTopicCount",
            render: v => {
              return v.totalTopicCount > 0
                ? <Link href={`/kafka/${v.clusterId}/topics`}>{`${v.totalTopicCount} (${v.internalTopicCount})`}</Link>
                : 0
            },
            editComponent: _ => null
          },
          {
            title: "Consumer Groups",
            field: "consumerGroupCount",
            editComponent: _ => null,
            render: v => {
              return v.consumerGroupCount > 0
                ? <Link href={`/kafka/${v.clusterId}/consumer-groups`}>{`${v.consumerGroupCount} (${v.consumerGroupCount})`}</Link>
                : 0
            }
          }
        ]}
        data={results}
        editable={{
          onRowDelete: oldData =>
            onAction(`mutation { deleteCluster(clusterId:"${oldData.clusterId}") }`),
          onRowUpdate: newData =>
            onAction(
              `mutation($clusterId: String!, $name: String!, $config: String!) { updateCluster(clusterId: $clusterId, name: $name, config: $config) { clusterId name config }}`,
              newData
            ),
          onRowAdd: newData =>
            onAction(
              `mutation($name: String!, $config: String!) { newCluster(name: $name, config: $config) { clusterId name config }}`,
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