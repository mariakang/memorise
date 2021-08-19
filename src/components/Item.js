import React from 'react';

export default class Item extends React.Component {
   constructor(props){
      super(props);
      this.state = {
        value1: this.props.value1,
        value2: this.props.value2,
      };
      this.handleChangeValue1 = this.handleChangeValue1.bind(this);
      this.handleChangeValue2 = this.handleChangeValue2.bind(this);
      this.handleDelete = this.handleDelete.bind(this);
   }
   componentDidUpdate(prevProps, prevState) {
     if (prevProps !== this.props) {
       this.setState({
         value1: this.props.value1,
         value2: this.props.value2,
       })
       console.log("value1 changed to " + this.state.value1 + ", value2 changed to " + this.state.value2);
     } else if (prevState !== this.state ) {
       let value1Update = this.state.value1 !== this.props.value1;
       let value2Update = this.state.value2 !== this.props.value2;
       if (value1Update || value2Update) {
         let item = [this.state.value1, this.state.value2];
         this.props.onChange(this.props.index, item);
       }
     }
   }
   handleChangeValue1(event) {
     this.setState({
       value1: event.target.value
     });
     console.log("value1 changed to " + this.state.value1);
   }
   handleChangeValue2(event) {
     this.setState({
       value2: event.target.value
     });
     console.log("value2 changed to " + this.state.value2);
   }
  handleDelete(event) {
    this.props.onDelete(event, this.props.index);
  }
  render() {
    let index = this.props.index;
    return (
      <div id={"item-" + index} className="tableRow-4">
        <div>{(index + 1) + ". "}</div>
        <input name={"item-" + index + "-0"} value={this.state.value1} onChange={this.handleChangeValue1} type="text"></input>
        <input name={"item-" + index + "-1"} value={this.state.value2} onChange={this.handleChangeValue2} type="text"></input>
        <button type="button" className="delete" onClick={this.handleDelete} tabIndex="-1"> <i className="fa fa-trash"></i>   </button>
      </div>
    );
  }
}
