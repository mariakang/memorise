import React from 'react';

export default class ContentsRow extends React.Component {
   constructor(props){
      super(props);
      this.handleGo = this.handleGo.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
   }
   handleGo(event) {
     this.props.onGo(event, this.props.record);
   }
   handleDelete(event) {
     this.props.onDelete(event, this.props.record);
   }
   render() {
     return (
      <div className="tableRow-3">
        <div></div>
        <div>{this.props.record.title}</div>
        <div className="headerSection-right">
          <button type="button" className="go" onClick={this.handleGo}>Go <i className="fa fa-arrow-right"></i></button>
          <button type="button" className="delete delete-medium" tabIndex="-1" onClick={this.handleDelete} disabled={this.props.username !== this.props.record.username}>Delete <i className="fa fa-trash"></i></button>
        </div>
      </div>
     );
   }
}
