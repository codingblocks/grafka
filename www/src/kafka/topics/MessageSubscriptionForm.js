import React, { useState } from "react";
import { makeStyles, MenuItem, TextField } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paddedInput: {
    paddingBottom: 40
  }
}));

export default ({ topic, hasSchema }) => {
  const classes = useStyles();
  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [values, setValues] = useState({
    latchSize: 100,
    latchTimeoutMs: 100,
    keyDeserializer: "org.apache.kafka.common.serialization.StringDeserializer",
    valueDeserializer: hasSchema
      ? "io.confluent.kafka.serializers.KafkaAvroDeserializer"
      : "org.apache.kafka.common.serialization.StringDeserializer",
    maxDisplayCount: 20
  });

  // how the heck can you unsubscribe?
  // control latch size / timeout
  return (
    <React.Fragment>
      <form noValidate autoComplete="off">
        <TextField
          label="Key Deserializer"
          id="keyDeserializer"
          value={values.keyDeserializer}
          className={classes.paddedInput}
          select
          helperText="Key format"
          fullWidth={true}
        >
          <MenuItem value="org.apache.kafka.common.serialization.StringDeserializer">
            StringDeserializer
          </MenuItem>
          <MenuItem value="org.apache.kafka.common.serialization.IntDeserializer">
            IntDeserializer
          </MenuItem>
        </TextField>

        <TextField
          label={"Value Deserializer"}
          id={"valueDeserializer"}
          value={values.valueDeserializer}
          onChange={handleChange("valueDeserializer")}
          className={classes.paddedInput}
          select
          helperText="Value format"
          fullWidth={true}
        >
          <MenuItem
            value="io.confluent.kafka.serializers.KafkaAvroDeserializer"
            disabled={!hasSchema}
          >
            KafkaAvroDeserializer
          </MenuItem>
          <MenuItem value="org.apache.kafka.common.serialization.StringDeserializer">
            StringDeserializer
          </MenuItem>
          <MenuItem value="org.apache.kafka.common.serialization.IntDeserializer">
            IntDeserializer
          </MenuItem>
        </TextField>

        <TextField
          id="latchSize"
          onChange={handleChange("latchSize")}
          value={values.latchSize}
          label="Latch Size"
          className={classes.paddedInput}
          helperText="# of messages to wait for before returning"
          fullWidth={true}
        />

        <TextField
          id="latchTimeoutMs"
          onChange={handleChange("latchTimeoutMs")}
          value={values.latchTimeoutMs}
          label="Latch Timeout Ms"
          className={classes.paddedInput}
          helperText="How long to wait before returning messages"
          fullWidth={true}
        />

        <TextField
          id="startingOffset"
          onChange={handleChange("startingOffset")}
          value={values.latchTimeoutMs}
          label="Starting Offset"
          className={classes.paddedInput}
          helperText="leave blank to start at max offset"
          fullWidth={true}
        />

        <TextField
          id="maxDisplayCount"
          onChange={handleChange("maxDisplayCount")}
          value={values.maxDisplayCount}
          label="Display Count"
          className={classes.paddedInput}
          helperText="# of messages to show in UI"
          fullWidth={true}
        />
      </form>
    </React.Fragment>
  );
};
