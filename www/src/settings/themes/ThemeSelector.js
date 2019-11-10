import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, FormControl, MenuItem, Select } from "@material-ui/core";
import Themes from "./Themes";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function ThemeSelector({ themeChangedCallback }) {
  const classes = useStyles();
  const [currentTheme, setCurrentTheme] = useState(
    Themes.getCurrentThemeName()
  );
  const themes = Themes.getSelectableThemes();
  const themeChangeHandler = event => {
    const value = event.target.value;
    setCurrentTheme(value);
    Themes.changeCurrentTheme(value);
    if (themeChangedCallback) {
      themeChangedCallback();
    }
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="theme-select">Theme</InputLabel>
      <InputLabel htmlFor="theme-select">Theme</InputLabel>
      <Select
        value={currentTheme}
        onChange={themeChangeHandler}
        inputProps={{ name: "theme", id: "theme-selector" }}
      >
        {themes.map(t => (
          <MenuItem value={t} key={t}>
            {t}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
