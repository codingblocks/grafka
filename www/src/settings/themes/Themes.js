import { createMuiTheme } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/blueGrey";
import pink from "@material-ui/core/colors/pink";
import red from "@material-ui/core/colors/red";

const storageKey = "website-theme-name";

const themes = {
  Light: {
    palette: {
      type: "light"
    }
  },
  Dark: {
    palette: {
      type: "dark"
    }
  },
  // just an example
  Silverhawk: {
    palette: {
      type: "dark",
      primary: grey,
      secondary: pink,
      error: red,
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2
    }
  }
};

const storage = window.localStorage;
const defaultThemeName = "Silverhawk";

const Themes = {
  getSelectableThemes: () => {
    return Object.keys(themes).sort();
  },
  getCurrentTheme: () => {
    return createMuiTheme(themes[Themes.getCurrentThemeName()]);
  },
  getCurrentThemeName: () => {
    return themes[storage.getItem(storageKey) || defaultThemeName]
      ? storage.getItem(storageKey) || defaultThemeName
      : defaultThemeName;
  },
  changeCurrentTheme: themeName => {
    if (themes[themeName]) {
      storage.setItem(storageKey, themeName);
    }
  }
};

export default Themes;
