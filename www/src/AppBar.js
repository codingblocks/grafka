import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import MenuIcon from "@material-ui/icons/Menu";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Settings from "./settings/Settings";
import { ListItem } from "@material-ui/core";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
}));

export default function ButtonAppBar() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });
  const classes = useStyles();
  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const fullList = side => (
    <div
      className={classes.fullList}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem button component="a" href="/">
          <ListItemIcon><Settings.icons.Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button component="a" href="/kafka/clusters">
          <ListItemIcon><Settings.icons.Clusters /></ListItemIcon>
          <ListItemText primary="Clusters" />
        </ListItem>

        <ListItem button component="a" href="/kafka/connect">
          <ListItemIcon><Settings.icons.Connect /></ListItemIcon>
          <ListItemText primary="Connect" />
        </ListItem>

        <ListItem button component="a" href="/preferences">
          <ListItemIcon><Settings.icons.Settings /></ListItemIcon>
          <ListItemText primary="Preferences" />
        </ListItem>

        <Divider />

        <ListItem button component="a" href={Settings.queryUiUrl} target="queryUi">
          <ListItemIcon primary="Query UI"><Settings.icons.QueryUI /></ListItemIcon>
          <ListItemText primary="Query UI" />
        </ListItem>

        <ListItem button component="a" href="https://github.com/codingblocks/grafka" target="_blank">
          <ListItemIcon><Settings.icons.SourceCode /></ListItemIcon>
          <ListItemText primary="Source Code" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" onClick={toggleDrawer("left", true)}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
            <Drawer open={state.left} onClose={toggleDrawer("left", false)}>
              {fullList("left")}
            </Drawer>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Grafka
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
