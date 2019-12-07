import React from "react";
import { Card, Divider, Grid, Container } from "@material-ui/core";
import MaterialTable from "material-table";
import tableIcons from "../../settings/TableIcons";

export default ({ partitions }) => {
  const currentMessages = partitions.reduce((sum, p) => sum + p.offsetCount, 0);
  const lifetimeMessages = partitions.reduce((sum, p) => sum + p.endOffset, 0);
  return (
    <React.Fragment>
      <Card>
        <h2>Partitions</h2>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <p>Partitions: {partitions.length}</p>
          </Grid>
          <Grid item xs={6}>
            <p>Current Messages: {currentMessages}</p>
            <p>Lifetime Messages: {lifetimeMessages}</p>
          </Grid>
        </Grid>
        <Divider />
        <MaterialTable
          data={partitions.sort((a, b) => (a.partition > b.partition ? 1 : -1))}
          icons={tableIcons}
          title="Details"
          options={{
            paging: false
          }}
          columns={[
            {
              title: "Partition",
              field: "partition"
            },
            {
              title: "Messages",
              field: "offsetCount"
            },
            {
              title: "Partition Offsets",
              render: v =>
                v.beginningOffset === v.endOffset
                  ? v.endOffset
                  : `${v.beginningOffset}-${v.endOffset}`
            },
            {
              title: "Leader",
              render: v => `${v.leader.host}:${v.leader.port}`
            },
            {
              title: "Leader Rack",
              render: v => v.leader.rack
            },
            {
              title: "Replicas",
              render: v => v.replicas.map(i => `${i.host}:${i.port}`).join(", ")
            },
            {
              title: "In Sync Replicas",
              render: v => v.isr.map(i => `${i.host}:${i.port}`).join(", ")
            }
          ]}
        />
      </Card>
    </React.Fragment>
  );
};
