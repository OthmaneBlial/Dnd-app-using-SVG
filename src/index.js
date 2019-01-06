import React from "react";
import ReactDOM from "react-dom";
import Rectangle from "./components/Rectangle";
import Rect from "./components/Rect";

import "./styles.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Rectangle />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
