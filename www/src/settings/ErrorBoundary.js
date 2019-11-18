import React from "react";
import Button from "@material-ui/core/Button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // TODO logging?
  }

  render() {
    const clearCache = () => {
      window.localStorage.clear();
      window.location.reload()
    };

    if (this.state.hasError) {
      return <React.Fragment>
        <p>Argh! We caught a rendering error. You might want to try clearing the local cache?</p>
        <Button onClick={clearCache.bind(this)}>Clear Local Storage</Button>
      </React.Fragment>
    }

    return this.props.children;
  }
}