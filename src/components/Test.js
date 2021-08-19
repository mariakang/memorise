import React from 'react';

export default class Test extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mode: "start",
      items: this.props.record.items,
      shuffled: false,
      questionCol: 0,
      answerCol: 1,
      multipleChoice: false,
      questionCount: 0,
      question: "",
      answer: "",
      options: [],
      guess: "",
      correct: true,
      correctCount: 0,
      passCount: 0
    };
    this.handleChangeDirection = this.handleChangeDirection.bind(this);
    this.handleChangeMultipleChoice = this.handleChangeMultipleChoice.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleReorder = this.handleReorder.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
    this.handleChangeGuess = this.handleChangeGuess.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  handleChangeDirection(event) {
    let q = this.state.answerCol;
    let a = this.state.questionCol;
    this.setState({
      questionCol: q,
      answerCol: a
    });
    console.log("questionCol changed to " + this.state.questionCol + ", answerCol changed to " + this.state.answerCol);
  }
  handleChangeMultipleChoice(event) {
    this.setState({
      multipleChoice: !this.state.multipleChoice
    });
    console.log("multipleChoice changed to " + this.state.multipleChoice);
  }
  handleReset(event) {
    this.setState({
      mode: "start",
      questionCount: 0,
      correctCount: 0,
      passCount: 0
   });
    console.log("mode changed to " + this.state.mode
                + ", questionCount changed to " + this.state.questionCount
                + ", correctCount changed to " + this.state.correctCount
                + ", passCount changed to " + this.state.passCount);
  }
  handleShuffle(event) {
    const shuffled = this.state.items.slice().sort((a, b) => 0.5 - Math.random());
    this.setState({
      items: shuffled,
      shuffled: true,
      questionCount: 0,
      correctCount: 0,
      passCount: 0
    });
    console.log("items changed to " + this.state.items
                + ", shuffled changed to " + this.state.shuffled
                + ", questionCount changed to " + this.state.questionCount
                + ", correctCount changed to " + this.state.correctCount
                + ", passCount changed to " + this.state.passCount);
  }
  handleReorder(event) {
    this.setState({
      items: this.props.record.items,
      shuffled: false,
      questionCount: 0,
      correctCount: 0,
      passCount: 0
    });
    console.log("items changed to " + this.state.items
                + ", shuffled changed to " + this.state.shuffled
                + ", questionCount changed to " + this.state.questionCount
                + ", correctCount changed to " + this.state.correctCount
                + ", passCount changed to " + this.state.passCount);
  }
  handleNext(event) {
    let count = this.state.questionCount;
    let pair = this.state.items[count];
    let options = [];
    if (this.state.multipleChoice) {
      options = this.getOptions(count, this.state.answerCol);
    }
    this.setState({
      mode: "question",
      questionCount: count + 1,
      question: pair[this.state.questionCol],
      answer: pair[this.state.answerCol],
      options: options,
      guess: ""
    });
    console.log("mode changed to " + this.state.mode
                + ", questionCount changed to " + this.state.questionCount
                + ", question changed to " + this.state.question
                + ", answer changed to " + this.state.answer
                + ", options changed to " + this.state.options
                + ", guess changed to " + this.state.guess);
  }
  handleFinish(event) {
    this.setState({
      mode: "end",
      question: "",
      answer: "",
      options: [],
      guess: ""
    });
    console.log("mode changed to " + this.state.mode
                + ", question changed to " + this.state.question
                + ", answer changed to " + this.state.answer
                + ", options changed to " + this.state.options
                + ", guess changed to " + this.state.guess);
  }
  handleChangeGuess(event) {
    this.setState({
      guess: event.target.value
    });
    console.log("guess changed to " + this.state.guess);
  }
  handleSubmit(event) {
    let correct = this.state.answer.toString().toLowerCase() === this.state.guess.toString().toLowerCase();
    let correctCount = this.state.correctCount;
    if (correct) {
      correctCount += 1;
    }
    this.setState({
      mode: "result",
      correct: correct,
      correctCount: correctCount
    });
    console.log("mode changed to " + this.state.mode + ", correct changed to " + this.state.correct + ", correctCount changed to " + this.state.correctCount);
  }
  getOptions(rowIndex, colIndex) {
    let items = this.state.items;
    let answers = items.map(x => x[colIndex]).filter((x, i, arr) => arr.slice(0, i).indexOf(x) === -1);
    let numOptions = answers.length < 4 ? answers.length : 4;
    let ans = items[rowIndex][colIndex];
    let options = [ans];
    answers = answers.filter(x => x !== ans);
    while (options.length < numOptions) {
      let index = Math.floor(Math.random() * Math.floor(answers.length));
      let opt = answers[index];
      answers = answers.filter(x => x !== opt);
      options.push(opt);
    }
    return options.sort((a, b) => 0.5 - Math.random());
  }
  handlePass(event) {
    this.setState({
      mode: "pass",
      passCount: this.state.passCount + 1
    });
    console.log("mode changed to " + this.state.mode + ", passCount changed to " + this.state.correctCount);
  }
  render() {
    let mode = this.state.mode;
    let col1 = this.props.record.column1;
    let col2 = this.props.record.column2;
    let qCol = this.state.questionCol === 0 ? col1 : col2;
    let aCol = this.state.answerCol === 1 ? col2 : col1;
    let checkbox = (<input type="checkbox" className="checkbox" name="multipleChoice" value="multipleChoice" onChange={this.handleChangeMultipleChoice}></input>);
    if (this.state.multipleChoice) {
      checkbox = (<input type="checkbox" className="checkbox" name="multipleChoice" value="multipleChoice" onChange={this.handleChangeMultipleChoice} checked></input>);
    }
    let multipleChoice = this.state.multipleChoice;
    let shuffle = (
      <div className="row">
        <div className="description">Shuffle list: </div>
        <button onClick={this.handleShuffle}>Shuffle</button>
      </div>
    );
    if (this.state.shuffled) {
      shuffle = (
        <div className="row">
          <div className="description">Reorder list: </div>
          <button onClick={this.handleReorder}>Reorder</button>
        </div>
      );
    }
    let content = (
      <div className="column">
        <h1>{this.props.record.title}</h1>
        <div className="row">
          <h3>How do you want this test to work?</h3>
          <div></div>
        </div>
        <div className="row">
          <div className="description">Give me <b>{qCol}</b> values and I'll guess <b>{aCol}</b> values</div>
          <button onClick={this.handleChangeDirection} className="switch">Switch</button>
        </div>
        <div className="row">
          <div className="description">I want this to be multiple choice</div>
          {checkbox}
        </div>
        {shuffle}
        <button onClick={this.handleNext} className="test">Start!</button>
      </div>
    );
    if (mode === "question") {
      let input = (
        <input onChange={this.handleChangeGuess} type="text" autoFocus className="guess"></input>
      );
      if (multipleChoice) {
        let options = this.state.options;
        input = options.map(x => (
            <div className="option">
              <input className="radio" onChange={this.handleChangeGuess} type="radio" value={x} name="options"></input>
              <label>{x}</label>
            </div>
        ));
      }
      content = (
        <div className="column">
          <h1>{this.state.question}</h1>
          <div className="column auto-width">
            {input}
          </div>
          <button onClick={this.handleSubmit} className="test">Submit</button>
          <button onClick={this.handlePass}>Pass</button>
        </div>
      );
    } else if (mode === "result") {
      let correct = this.state.correct;
      let message = (
        <h1 className="green">Correct!</h1>
      );
      let answer = null;
      if (!correct) {
        message = (
          <h1 className="red">Wrong</h1>
        );
        answer = (
          <div className="answer">The correct answer is <b>{this.state.answer}</b></div>
        );
      }
      let next = null;
      if (this.state.questionCount < this.state.items.length) {
        next = (
          <button onClick={this.handleNext} className="test">Next</button>
        );
      }
      content = (
        <div className="column">
          <h1>{message}</h1>
          {answer}
          {next}
          <button onClick={this.handleFinish}>Finish</button>
        </div>
      );
    } else if (mode === "pass") {
      let next = null;
      if (this.state.questionCount < this.state.items.length) {
        next = (
          <button onClick={this.handleNext} className="test">Next</button>
        );
      }
      content = (
        <div className="column">
          <div className="answer">The correct answer is <b>{this.state.answer}</b></div>
          {next}
          <button onClick={this.handleFinish}>Finish</button>
        </div>
      );
    } else if (mode === "end") {
      content = (
        <div className="column">
          <h1>You've completed the test!</h1>
          <div className="row">
            <div>Questions asked: </div>
            <div>{this.state.questionCount}</div>
          </div>
          <div className="row">
            <div>Correct answers: </div>
            <div>{this.state.correctCount}</div>
          </div>
          <div className="row">
            <div>Passes: </div>
            <div>{this.state.passCount}</div>
          </div>
          <button onClick={this.handleReset} className="test">Go again!</button>
        </div>
      );
    }
    return content;
  }
}
