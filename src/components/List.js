import React from 'react';

export default class List extends React.Component {
  render() {
    const items = this.props.record.items.map((x, i) => (
      <div className="tableRow-3">
        <div>{(i + 1) + ". "}</div>
        <div className="tableCell">{x[0]}</div>
        <div className="tableCell">{x[1]}</div>
      </div>
    ));
    return (
      <div className="column">
        <h1>{this.props.record.title}</h1>
        <div className="table">
          <div className="tableRow-3 tableHeading">
            <div className="columnHeading"></div>
            <div className="columnHeading"><h3>{this.props.record.column1}</h3></div>
            <div className="columnHeading"><h3>{this.props.record.column2}</h3></div>
          </div>
          <div className="table tableBody">
            {items}
          </div>
        </div>
        <div className="tableEnding"></div>
      </div>
    );
  }
}
