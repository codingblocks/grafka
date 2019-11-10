import React from "react";
import Themes from "./themes/Themes";
import ThemeSelector from "./themes/ThemeSelector";
import { Settings } from "@material-ui/icons/";

export default function Preferences({ themeChangedCallback }) {
  return (
    <React.Fragment>
      <h1><Settings /> Preferences</h1>
      <ThemeSelector themeChangedCallback={themeChangedCallback} />
    </React.Fragment>
  );
}

export function getCurrentTheme() {
  return Themes.getCurrentTheme();
}
