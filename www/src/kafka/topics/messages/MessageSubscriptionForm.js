import React, {useState} from "react";
import { makeStyles, Button, MenuItem, TextField } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  paddedInput: {
    paddingBottom: 40
  }
}));

const knownDeserializers = "io.confluent.kafka.serializers.KafkaAvroDeserializer,org.apache.kafka.common.serialization.ByteArrayDeserializer,org.apache.kafka.common.serialization.ByteBufferDeserializer,org.apache.kafka.common.serialization.BytesDeserializer,org.apache.kafka.common.serialization.DoubleDeserializer,org.apache.kafka.common.serialization.FloatDeserializer,org.apache.kafka.common.serialization.IntegerDeserializer,org.apache.kafka.common.serialization.LongDeserializer,org.apache.kafka.common.serialization.SessionWindowedDeserializer,org.apache.kafka.common.serialization.ShortDeserializer,org.apache.kafka.common.serialization.StringDeserializer,org.apache.kafka.common.serialization.TimeWindowedDeserializer,org.apache.kafka.common.serialization.UUIDDeserializer".split(",");

export default function MessageSubscriptionForm ({ subscriptionSettings, onChange }) {
  const classes = useStyles();
  const [values, setValues] = useState(subscriptionSettings);
  console.log(values);
  const handleChange = prop => event =>{
      setValues({ ...values, [prop]: event.target.value });
  };

  const onSave = () => {
    onChange && onChange(values);
  };

  // how the heck can you unsubscribe?
  // control latch size / timeout
  return (
    <React.Fragment>
      <form noValidate autoComplete="off">
        <TextField
          label="Key Deserializer"
          id="keyDeserializer"
          value={values.keyDeserializer}
          onChange={handleChange("keyDeserializer")}
          className={classes.paddedInput}
          select
          helperText="Key format"
          fullWidth
        >
          {knownDeserializers.map(d => <MenuItem key={d} value={d}>{d.split(".").slice(-1)}</MenuItem>)}
        </TextField>

        <TextField
          label={"Value Deserializer"}
          id={"valueDeserializer"}
          value={values.valueDeserializer}
          onChange={handleChange("valueDeserializer")}
          className={classes.paddedInput}
          select
          helperText="Value format"
          fullWidth
        >
          {knownDeserializers.map(d => <MenuItem key={d} value={d}>{d.split(".").slice(-1)}</MenuItem>)}
        </TextField>

        <TextField
          id="latchSize"
          onChange={handleChange("latchSize")}
          value={values.latchSize}
          label="Latch Size"
          className={classes.paddedInput}
          helperText="# of messages to wait for before returning"
          fullWidth
        />

        <TextField
          id="latchTimeoutMs"
          onChange={handleChange("latchTimeoutMs")}
          value={values.latchTimeoutMs}
          label="Latch Timeout Ms"
          className={classes.paddedInput}
          helperText="How long to wait before returning messages"
          fullWidth
        />

        <TextField
          id="startingOffset"
          onChange={handleChange("startingOffset")}
          value={values.startingOffset}
          label="Starting Offset"
          className={classes.paddedInput}
          helperText="leave blank to start at max offset"
          fullWidth
        />

        <TextField
          id="maxDisplayCount"
          onChange={handleChange("maxDisplayCount")}
          value={values.maxDisplayCount}
          label="Display Count"
          className={classes.paddedInput}
          helperText="# of messages to show in UI"
          fullWidth
        />

        <Button onClick={() => onChange && onChange(values)} color={"primary"} variant="contained">Update</Button>
      </form>
    </React.Fragment>
  );
};
