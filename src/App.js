import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1 className="h1">Lottoschein</h1>
      <LotteryTicket />
    </div>
  );
}

const MAX_ACTIVE_TICKET_FIELDS = 6;
const FIELDS = 49;

class LotteryTicket extends React.Component {
  state = { message: "", activeFields: new Set(), continue: false };

  callbackFunction = childKey => {
    console.log("message from child " + childKey + " this ");
    console.log(this);

    if (this.state.activeFields.has(childKey)) {
      this.setState({ childKey: this.state.activeFields.delete(childKey) });
      this.setContinueState(this.state.activeFields.size);
      return true;
    }
    if (
      !this.state.activeFields.has(childKey) &&
      this.state.activeFields.size < MAX_ACTIVE_TICKET_FIELDS
    ) {
      this.setState({ childKey: this.state.activeFields.add(childKey) });
      this.setContinueState(this.state.activeFields.size);
      return true;
    } else {
      return false;
    }
  };

  componentDidMount() {
    this.initializeFields();
  }

  initializeFields() {
    let fieldsList = [];
    for (let index = 1; index <= FIELDS; index++) {
      fieldsList.push(
        <TicketField
          key={index}
          customKey={index}
          content={index}
          parentCallback={this.callbackFunction}
        />
      );
    }
    this.setState({ fields: fieldsList });
  }

  setContinueState(size) {
    if (this.state.activeFields.size == MAX_ACTIVE_TICKET_FIELDS) {
      this.setState({ continue: true });
    } else {
      this.setState({ continue: false });
    }
  }

  render() {
    return (
      <div className="content">
        <div className="gridWrapper">{this.state.fields}</div>
        <div className="floatRight">
          <button
            className={
              "btn-continue" +
              " " +
              (this.state.continue ? "show" : "hide fade-out")
            }
          >
            Weiter
          </button>
        </div>
      </div>
    );
  }
}

class TicketField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  handleClick = e => {
    const changeState = this.props.parentCallback(this.props.customKey);

    console.log(e.target);
    if (changeState) {
      this.setState({ isActive: !this.state.isActive });
    } else {
      this.setState({ isWarning: true });
    }
  };

  render() {
    return (
      <span
        onClick={this.handleClick}
        onAnimationEnd={e => {
          e.target.classList.remove("wiggle");
          this.setState({ isWarning: false });
        }}
        className={
          "ticketField" +
          " " +
          (this.state.isActive ? "ticketFieldActive" : "ticketFieldInactive") +
          " " +
          (this.state.isWarning ? "wiggle" : "")
        }
      >
        {this.props.content}
      </span>
    );
  }
}

export default App;
