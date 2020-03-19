import React from "react";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <section className="lotto-ticket">
        <h1 className="lotto-ticket__caption">Lottoschein</h1>
        <LotteryTicket />
      </section>
    </div>
  );
}

const MAX_ACTIVE_TICKET_FIELDS = 6;
const FIELDS = 49;

class LotteryTicket extends React.Component {
  state = {
    message: "",
    activeFields: new Set(),
    continue: false,
    showLuckyNumbers: false
  };

  callbackFunction = childKey => {
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
    if (this.state.activeFields.size === MAX_ACTIVE_TICKET_FIELDS) {
      this.setState({ continue: true });
    } else {
      this.setState({ continue: false });
    }
  }

  render() {
    return (
      <div className="lotto-ticket__content">
        <div className="lotto-ticket__grid">{this.state.fields}</div>
        <div className="lotto-ticket__content--floatRight">
          <button
            onClick={() => this.setState({ showLuckyNumbers: true })}
            className={`
              lotto-ticket__button
              ${
                this.state.continue
                  ? "lotto-ticket__button--show"
                  : "lotto-ticket__button--hide fade-out"
              }`}
          >
            Weiter
          </button>
        </div>
        <ChosenList
          list={Array.from(this.state.activeFields).sort((a, b) => a - b)}
          className={this.state.showLuckyNumbers ? "" : "lucky-numbers--hide"}
        />
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

    if (changeState) {
      this.setState({ isActive: !this.state.isActive });
    } else {
      this.setState({ isWarning: true });
    }
  };

  render() {
    return (
      <button
        onClick={this.handleClick}
        onAnimationEnd={e => {
          e.target.classList.remove("ticket-field--wiggle");
          this.setState({ isWarning: false });
        }}
        className={`ticket-field
          ${
            this.state.isActive
              ? "ticket-field--active"
              : "ticket-field--inactive"
          }
          ${this.state.isWarning ? "ticket-field--wiggle" : ""}`}
      >
        {this.props.content}
      </button>
    );
  }
}

function ChosenList(props) {
  const listItems = props.list.map(number => <li key={number}>{number}</li>);

  if (listItems.length > 0) {
    return (
      <section className={`lucky-numbers ${props.className}`}>
        <h1 className="lucky-numbers__caption">
          Deine ausgewählten Glückszahlen
        </h1>
        <ul className="lucky-numbers__list">{listItems}</ul>
      </section>
    );
  } else {
    return "";
  }
}

export default App;
