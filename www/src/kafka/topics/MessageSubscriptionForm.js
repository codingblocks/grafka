import React, { useState } from "react";
import { makeStyles, MenuItem, TextField } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paddedInput: {
    paddingBottom: 40
  }
}));

const knownDeserializers = "io.confluent.kafka.serializers.KafkaAvroDeserializer,org.apache.kafka.common.serialization.ByteArrayDeserializer,org.apache.kafka.common.serialization.ByteBufferDeserializer,org.apache.kafka.common.serialization.BytesDeserializer,org.apache.kafka.common.serialization.DoubleDeserializer,org.apache.kafka.common.serialization.FloatDeserializer,org.apache.kafka.common.serialization.IntegerDeserializer,org.apache.kafka.common.serialization.LongDeserializer,org.apache.kafka.common.serialization.SessionWindowedDeserializer,org.apache.kafka.common.serialization.ShortDeserializer,org.apache.kafka.common.serialization.StringDeserializer,org.apache.kafka.common.serialization.TimeWindowedDeserializer,org.apache.kafka.common.serialization.UUIDDeserializer".split(",");

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
          {knownDeserializers.map(d => <MenuItem value="org.apache.kafka.common.serialization.StringDeserializer">{d.split(".").slice(-1)}</MenuItem>)}
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
          {knownDeserializers.map(d => <MenuItem value="org.apache.kafka.common.serialization.StringDeserializer">{d.split(".").slice(-1)}</MenuItem>)}
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
