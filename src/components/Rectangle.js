import React from "react";

export default class Rectangle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rect: {},
      line: {},
      mouseX: 0,
      mouseY: 0,
      offsetX: 0,
      offsetY: 0,
      rectSelectedId: "",
      rectSelected: null,
      connectingRects: false,
      rectsToBeConnected: []
    };
  }

  getLineCordsOfTwoRects(rect1, rect2) {
    this.setState({
      line: {
        x1: parseFloat(rect1.x) + parseFloat(rect1.width / 2),
        y1: parseFloat(rect1.y) + parseFloat(rect1.height / 2),
        x2: parseFloat(rect2.x) + parseFloat(rect2.width / 2),
        y2: parseFloat(rect2.y) + parseFloat(rect2.height / 2)
      }
    });
  }

  getMousePosition(e) {
    const CTM = document.getElementById("canvas").getScreenCTM();
    this.setState({
      mouseX: (e.clientX - CTM.e) / CTM.a,
      mouseY: (e.clientY - CTM.f) / CTM.d
    });
  }

  setRectAsSelected(e) {
    const rectSelectedId = e.target.id;
    const rectSelected = document.getElementById(rectSelectedId);
    const rectCords = {
      x: parseFloat(rectSelected.getAttributeNS(null, "x")),
      y: parseFloat(rectSelected.getAttributeNS(null, "y")),
      width: parseFloat(rectSelected.getAttributeNS(null, "width")),
      height: parseFloat(rectSelected.getAttributeNS(null, "height"))
    };

    this.setState(
      {
        rectSelectedId,
        rectSelected: document.getElementById(rectSelectedId),
        rect: rectCords
      },
      () => {
        document
          .querySelectorAll(".rectangle")
          .forEach(el => (el.style.strokeWidth = "3px"));
        document.getElementById(this.state.rectSelectedId).style.strokeWidth =
          "10px";
      }
    );
  }

  onStartDragging(e) {
    const { rectSelected, mouseX, mouseY } = this.state;
    rectSelected &&
      this.setState({
        offsetX:
          mouseX - parseFloat(rectSelected.getAttributeNS(null, "x")) - 10,
        offsetY:
          mouseY - parseFloat(rectSelected.getAttributeNS(null, "y")) - 10
      });
  }

  onDragging(e) {
    this.getMousePosition(e);
    const { rectSelected, mouseX, mouseY, offsetX, offsetY } = this.state;
    if (rectSelected) {
      let newRect = {
        x: mouseX - offsetX,
        y: mouseY - offsetY,
        width: this.state.rect.width,
        height: this.state.rect.height
      };

      this.setState({
        rect: newRect
      });
      rectSelected.setAttributeNS(null, "x", mouseX - offsetX);
      rectSelected.setAttributeNS(null, "y", mouseY - offsetY);
      //this.getLineCordsOfTwoRects();
    }
  }

  onEndDragging(e) {
    this.setState({
      rectSelected: null
    });
  }

  setRectToBeConnected() {
    this.setState({
      connectingRects: true,
      rectsToBeConnected: [
        ...this.state.rectsToBeConnected,
        this.state.rectSelectedId
      ]
    });
  }

  iconsBar(top, left, display) {
    return (
      <div
        id="iconsBar"
        style={{
          position: "absolute",
          top: top || -30,
          left: left
        }}
      >
        <i
          onClick={() => this.removeSelectedObject()}
          className="fa fa-trash-o"
          aria-hidden="true"
        />
        <i className="fa fa-magic" aria-hidden="true" />
        <i
          onClick={() => this.changeTypeOfSelectedObject()}
          className="fa fa-exchange"
          aria-hidden="true"
        />
        <i
          onClick={() => this.setRectToBeConnected()}
          style={{ background: this.state.connectingRects ? "red" : "" }}
          className="fa fa-plug"
          aria-hidden="true"
        />
      </div>
    );
  }

  componentWillUnmount() {}

  componentDidUpdate() {
    //console.log(this.state.mouseX, this.state.mouseY);
  }

  componentDidMount() {
    //this.getLineCordsOfTwoRects();
  }

  render() {
    const { rect, rectSelected, line } = this.state;
    return (
      <div>
        {this.iconsBar(rect.y - 30, rect.x)}
        <svg
          id="canvas"
          width="2000"
          height="2000"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onMouseDown={e => this.onStartDragging(e)}
          onMouseMove={e => this.onDragging(e)}
          onMouseUp={e => this.onEndDragging(e)}
        >
          <rect
            x="50"
            y="20"
            width="100"
            height="100"
            className="rectangle"
            id="rect1"
            onClick={e => this.setRectAsSelected(e)}
          />
          <rect
            x="200"
            y="300"
            width="100"
            height="100"
            className="rectangle"
            id="rect2"
            onClick={e => this.setRectAsSelected(e)}
          />
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="line"
          />
        </svg>
      </div>
    );
  }
}
