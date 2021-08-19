import React from 'react';
import $ from 'jquery';

export default class DeleteList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false,
      errorMessage: ""
    };
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleAcknowledgeError = this.handleAcknowledgeError.bind(this);
  }
  handleConfirmDelete(event) {
    this.setState({
      isDeleting: true
    });
    console.log("isDeleting set to " + this.state.isDeleting);
    $.ajax({
      method: "POST",
      url: this.props.apiUrl + "/delete",
      headers: {
        Authorization: this.props.authToken,
      },
      data: JSON.stringify({
        listId: this.props.listId,
      }),
      contentType: 'application/json',
      success: (response) => {
        console.log(response);
        console.log('Successfully deleted list');
        window.location.href = 'index.html';
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.error('Error deleting list: ', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
        this.setState({
          isDeleting: false,
          errorMessage: 'An error occured when deleting this list:\n' + jqXHR.responseText
        });
        console.log("isDeleting set to " + this.state.isDeleting + ", errorMessage set to " + this.state.errorMessage);
      }
    });
  }
  handleAcknowledgeError(event) {
    window.location.href = 'index.html';
  }

  render() {
    let message = this.state.errorMessage !== ""
      ? this.state.errorMessage
      : this.props.allowed
        ? "Are you sure you want to delete this list?"
        : "You didn't create this list, so you can't delete it";
    let buttons = this.state.errorMessage === ""
      ? (
          <div className="row">
            <button onClick={this.props.onCancelDelete} disabled={this.state.isDeleting}>Cancel</button>
            <button className="delete delete-wide" onClick={this.handleConfirmDelete} disabled={!this.props.allowed || this.state.isDeleting}>Delete</button>
          </div>
        )
      : (<button onClick={this.handleAcknowledgeError}>OK</button>);
    let textClass = this.state.errorMessage === "" ? "modalText" : "modalText red";
    return (
      <div className="modal">
        <div className={textClass}>{message}</div>
        {buttons}
      </div>
    );
  }
}
