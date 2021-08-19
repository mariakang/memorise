import React from 'react';
import $ from 'jquery';
import Item from './Item';

export default class ListForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.record.title,
      column1: this.props.record.column1,
      column2: this.props.record.column2,
      items: this.props.record.items,
      public: this.props.record.publicOrPrivate === "public",
      rowsToAdd: 1,
      isSaving: false
    };
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeColumn1 = this.handleChangeColumn1.bind(this);
    this.handleChangeColumn2 = this.handleChangeColumn2.bind(this);
    this.handleChangeRowsToAdd = this.handleChangeRowsToAdd.bind(this);
    this.handleAddItems = this.handleAddItems.bind(this);
    this.handleChangeItems = this.handleChangeItems.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleTogglePublic = this.handleTogglePublic.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleChangeTitle(event) {
    this.setState({
      title: event.target.value
    });
    console.log("title changed to " + this.state.title);
  }
  handleChangeColumn1(event) {
    this.setState({
      column1: event.target.value
    });
    console.log("column1 changed to " + this.state.column1);
  }
  handleChangeColumn2(event) {
    this.setState({
      column2: event.target.value
    });
    console.log("column2 changed to " + this.state.column2);
  }
  handleChangeRowsToAdd(event) {
    this.setState({
      rowsToAdd: Number(event.target.value)
    });
    console.log("rowsToAdd changed to " + this.state.rowsToAdd);
  }
  handleAddItems(event) {
    let newItemsArray = this.state.items.slice();
    for (let i = 0; i < this.state.rowsToAdd; i++) {
      newItemsArray.push(["", ""]);
    }
    this.setState({
      items: newItemsArray,
    });
    console.log("items changed to " + this.state.items);
  }
  handleChangeItems(index, array) {
    let items = this.state.items;
    let pre = items.slice(0, index);
    let post = items.slice(index + 1);
    let newItems = [...pre, array, ...post];
    this.setState({
      items: newItems,
    });
    console.log("items changed to " + this.state.items);
  }
  handleDeleteItem(event, index) {
    let items = this.state.items;
    let pre = items.slice(0, index);
    let post = items.slice(index + 1);
    let newItems = [...pre, ...post];
    this.setState({
      items: newItems,
    });
    console.log("items changed to " + this.state.items);
  }
  handleTogglePublic(event) {
    this.setState({
      public: !this.state.public,
    });
    console.log("public changed to " + this.state.public);
  }

  handleSave(event) {
    this.setState({
      isSaving: true
    });
    console.log("isSaving set to " + this.state.isSaving);
    $.ajax({
      method: "POST",
      url: this.props.apiUrl + "/save",
      headers: {
        Authorization: this.props.authToken,
      },
      data: JSON.stringify({
        id: this.props.record.id,
        username: this.props.username,
        title: this.state.title,
        column1: this.state.column1,
        column2: this.state.column2,
        items: this.state.items,
        public: this.state.public
      }),
      contentType: 'application/json',
      success: (response) => {
        console.log(response);
        console.log('Successfully saved list');
        window.location.href = 'index.html';
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error('Error saving list: ', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
        alert('An error occured when saving this list:\n' + jqXHR.responseText);
      }
    });
  }
  
  render() {
    const title = this.state.title;
    const heading = title === "" ? "New list" : title;
    const column1 = this.state.column1;
    const column2 = this.state.column2;
    const items = this.state.items.map((x, i) => (
      <Item key={i}
        index={i}
        value1={x[0]}
        value2={x[1]}
        onChange={this.handleChangeItems}
        onDelete={this.handleDeleteItem} />
    ));
    const unpopulatedItems = this.state.items.filter(x => x[0] === "" && x[1] === "");
    const disabled = this.state.isSaving || title === "" || column1 === "" || column2 === "" || unpopulatedItems.length > 0;
    const publicOrPrivate = this.state.public ? "Public" : "Private";
    const makePublicOrPrivate = this.state.public ? "Make private" : "Make public";
    return (
      <div className="container">
        <h1>{heading}</h1>
        <div className="row">
          <label>Title: </label>
          <input name="title" value={title} onChange={this.handleChangeTitle} type="text"></input>
        </div>
        <div className="row">
          <label>Column 1: </label>
          <input name="column1" value={column1} onChange={this.handleChangeColumn1} type="text"></input>
        </div>
        <div className="row">
          <label>Column 2: </label>
          <input name="column2" value={column2} onChange={this.handleChangeColumn2} type="text"></input>
        </div>
        <div className="table">
          <div className="tableRow-4">
            <div></div>
            <div className="columnHeading"><h3>{column1}</h3></div>
            <div className="columnHeading"><h3>{column2}</h3></div>
            <div></div>
          </div>
          <div className="tableBody-form">
            {items}
          </div>
        </div>
        <div className="row">
          <div className="addRows">
            <div>Add </div>
            <input name="rowsToAdd" className="add" value={this.state.rowsToAdd} onChange={this.handleChangeRowsToAdd} type="number"></input>
            <div>{" row" + (this.state.rowsToAdd === 1 ? " " : "s ")}</div>
            <button className="add" type="button" disabled={this.state.rowsToAdd < 1} onClick={this.handleAddItems}>Add <i className="fa fa-plus"></i></button>
          </div>
        </div>
        <div className="row">
          <div>{publicOrPrivate}</div>
          <button onClick={this.handleTogglePublic}>{makePublicOrPrivate}</button>
        </div>
        <button onClick={this.handleSave} disabled={disabled}>Save <i className="fa fa-save"></i></button>
      </div>
    );
  }
}
