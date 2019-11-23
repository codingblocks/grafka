import React from "react";
import { Card } from "@material-ui/core";
import MaterialTable from "material-table";
import tableIcons from "../../settings/TableIcons";

export default ({ configs }) => {
  return (
    <Card>
      <MaterialTable
        data={configs.sort((a,b) => a.name > b.name ? 1 : -1)}
        icons={tableIcons}
        title="Topics"
        options={{
          paging: false
        }}
        columns={
          [
            {
              title: "Name",
              field: "name"
            },
            {
              title: "Value",
              field: "value"
            },
            {
              title: "Default",
              render: v => v.default ? "Yes" : "No"
            },
            {
              title: "Source",
              field: "source"
            },
            {
              title: "Read Only",
              field: "readOnly",
              render: v => v.readOnly ? "Yes" : "No"
            },
            {
              title: "Sensitive",
              field: "sensitive",
              render: v => v.sensitive ? "Yes" : "No"
            },
            {
              title: "Synonyms",
              field: "synonyms",
              render: v => {
                v.synonyms.map(s => `${s.name}:${s.value}`).join(", ")
              }
            }
          ]
        }
      />
    </Card>
  );
}
