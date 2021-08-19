import React from 'react';
import $ from 'jquery';
import ContentsRow from './ContentsRow';
import DeleteList from './DeleteList';
import List from './List';
import ListForm from './ListForm';
import Login from './Login';
import Test from './Test';

export default class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      mode: "loading",
      name: "",
      username: "",
      authToken: "",
      userLists: [],
      publicLists: [],
      activeList: {},
      deleteClicked: false,
      errorMessage: ""
    };
    this.handleNewList = this.handleNewList.bind(this);
    this.handleViewList = this.handleViewList.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDeleteList = this.handleDeleteList.bind(this);
    this.handleCancelDelete = this.handleCancelDelete.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleCancelCreate = this.handleCancelCreate.bind(this);
    this.handleLaunchTest = this.handleLaunchTest.bind(this);
    this.handlePublic = this.handlePublic.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleAcknowledgeError = this.handleAcknowledgeError.bind(this);
  }
  componentDidMount() {
    let cognitoUser = this.props.userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.log("Error getting user session");
          this.setState({
            mode: "login"
          });
          console.log("mode changed to " + this.state.mode);
        } else if (!session.isValid()) {
          console.log("User session is not valid");
          this.setState({
            mode: "login"
          });
          console.log("mode changed to " + this.state.mode);
        } else {
          let username = cognitoUser.getUsername();
          console.log("Username: " + username);
          cognitoUser.getUserAttributes((err, attributes) => {
            this.setState({
              name: attributes.find(x => x.Name === "name").Value,
              username: username,
              authToken: session.getIdToken().getJwtToken()
            });
            console.log("name changed to " + this.state.name + ", username changed to " + this.state.username + ", authToken changed to " + this.state.authToken);
            $.ajax({
              method: "POST",
              url: this.props.apiUrl + "/lists",
              headers: {
                Authorization: this.state.authToken,
              },
              data: JSON.stringify({
                username: username
              }),
              contentType: 'application/json',
              success: (response) => {
                console.log(response);
                this.setState({
                  mode: "home",
                  userLists: response.usernameLists,
                  publicLists: response.publicLists
                });
                console.log("mode changed to " + this.state.mode + ", user lists changed to " + this.state.userLists + ", public lists changed to " + this.state.publicLists);
                console.log('Successfully fetched lists');
              },
              error: (jqXHR, textStatus, errorThrown) => {
                this.setState({
                  errorMessage: 'An error occured when fetching your lists:\n' + jqXHR.responseText
                });
                console.log("errorMessage changed to " + this.state.errorMessage);
                console.error('Error fetching lists: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
              }
            });
          });
        }
      });
    } else {
      console.log("No user found");
      this.setState({
        mode: "login"
      });
      console.log("mode changed to " + this.state.mode);
    }
  }
  handleNewList(event) {
    this.setState({
      mode: "create"
    });
    console.log("mode changed to " + this.state.mode);
  }
  handleViewList(event, record) {
    this.setState({
      mode: "view",
      activeList: record
    });
    console.log("mode changed to " + this.state.mode + ", activeList changed to " + this.state.activeList);
  }
  handleDeleteList(event, record) {
    this.setState({
      deleteClicked: true,
      activeList: record
    });
    console.log("deleteClicked changed to " + this.state.deleteClicked + ", activeList changed to " + this.state.activeList);
  }
  handleCancelDelete(event) {
    this.setState({
      deleteClicked: false
    });
    console.log("deleteClicked changed to " + this.state.deleteClicked);
  }
  handleEdit(event) {
    this.setState({
      mode: "edit"
    });
    console.log("mode changed to " + this.state.mode);
  }
  handleHome(event) {
    this.setState({
      mode: "home",
      activeList: {}
    });
    console.log("mode changed to " + this.state.mode + ", activeRecord changed to " + this.state.activeRecord);
  }
  handleCancelEdit(event) {
    this.setState({
      mode: "view"
    });
    console.log("mode changed to " + this.state.mode);
  }
  handleCancelCreate(event) {
    this.setState({
      mode: "home",
      activeList: {}
    });
    console.log("mode changed to " + this.state.mode + ", activeRecord changed to " + this.state.activeRecord);
  }
  handleLaunchTest(event) {
    this.setState({
      mode: "test"
    });
    console.log("mode changed to " + this.state.mode);
  }
  handlePublic(event) {
    this.setState({
      mode: "public"
    }, () => {
      console.log("mode changed to " + this.state.mode);
    });
  }
  handleLogOut(event) {
    let cognitoUser = this.props.userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      console.log("User logged out");
      window.location.href = 'index.html'
    }
  }
  handleAcknowledgeError(event) {
    this.setState({
      errorMessage: ""
    });
    console.log("errorMessage changed to " + this.state.errorMessage);
  }

  render() {
    let heading = this.state.mode === "loading"
        ? "Loading..."
        : this.state.mode === "home"
          ? "Hello " + this.state.name
          : this.state.mode === "public"
            ? "Public lists"
            : "";
    let message = this.state.mode === "loading"
        ? "Loading lists..."
        : this.state.mode === "home"
          ? "You haven't created any lists yet"
          : this.state.mode === "public"
            ? "There aren't any public lists yet"
            : "";
    let lists = (<div className="description">{message}</div>);
    const array = this.state.mode === "home"
        ? this.state.userLists
        : this.state.mode === "public"
          ? this.state.publicLists
          : [];
    if (array.length > 0) {
      lists = array.map((x, i) => (
        <ContentsRow key={i}
          record={x}
          username={this.state.username}
          onGo={this.handleViewList}
          onDelete={this.handleDeleteList} />
      ));
    }
    let content = (
      <div className="container">
        <h1>{heading}</h1>
        <div className="row tableHeading">
          <h2>My lists</h2>
          <div></div>
        </div>
        <div className="table tableBody">
          {lists}
        </div>
        <div className="tableEnding"></div>
        <button onClick={this.handleNewList} disabled={this.state.mode === "loading"}>New list</button>
        <button onClick={this.handlePublic} disabled={this.state.mode === "loading"}>See public lists</button>
      </div>
    );
    if (this.state.mode === "login") {
      content = (
        <Login userPool={this.props.userPool} />
      );
    } else if (this.state.mode === "public") {
      content = (
        <div className="container">
          <h1>{heading}</h1>
          <div className="row tableHeading">
            <h2>Public lists</h2>
            <div></div>
          </div>
          <div className="table tableBody">
            {lists}
          </div>
          <div className="tableEnding"></div>
          <button onClick={this.handleHome}>Home <i className="fa fa-home"></i></button>
        </div>
      );
    } else if (this.state.mode === "create") {
      const newRecord = {
        id: "new",
        username: this.props.username,
        title: "",
        column1: "",
        column2: "",
        items: [["",""]],
        publicOrPrivate: "private"
      };
      content = (
        <div className="container">
          <ListForm record={newRecord}
            authToken={this.state.authToken}
            apiUrl={this.props.apiUrl}
            username={this.state.username} />
          <button onClick={this.handleCancelCreate}>Cancel</button>
        </div>
      );
    } else if (this.state.mode === "view") {
      content = (
        <div className="container">
          <List record={this.state.activeList} />
          <button onClick={this.handleLaunchTest} className="test">Test me!</button>
          <button onClick={this.handleEdit} disabled={this.state.username !== this.state.activeList.username}>Edit <i className="fa fa-edit"></i></button>
          <button onClick={this.handleHome}>Home <i className="fa fa-home"></i></button>
        </div>
      );
    } else if (this.state.mode === "test") {
      content = (
        <div className="container">
          <Test record={this.state.activeList} />
          <button onClick={this.handleHome}>Home <i className="fa fa-home"></i></button>
        </div>
      );
    } else if (this.state.mode === "edit") {
      content = (
        <div className="container">
          <ListForm record={this.state.activeList}
            authToken={this.state.authToken}
            apiUrl={this.props.apiUrl}
            username={this.state.username} />
          <button onClick={this.handleCancelEdit}>Cancel</button>
        </div>
      );
    }
    let modal = null;
    if (this.state.errorMessage !== "") {
      modal = (
        <div className="modalContainer">
          <div className="modal">
            <div className="modalText red">{this.state.errorMessage}</div>
            <button onClick={this.handleAcknowledgeError}>OK</button>
          </div>
        </div>
      );
    } else if (this.state.deleteClicked) {
      modal = (
        <div className="modalContainer">
          <DeleteList listId={this.state.activeList.id}
            allowed={this.state.username === this.state.activeList.username}
            authToken={this.state.authToken}
            apiUrl={this.props.apiUrl}
            onCancelDelete={this.handleCancelDelete} />
        </div>
      );
    }
    let title = this.state.activeList.title
      ? this.state.activeList.title
      : this.state.mode === "login"
        ? "Login / Register"
        : "";
    let logOut = this.state.authToken === ""
      ? null
      : (<button onClick={this.handleLogOut} className="headerItemLink">Log out</button>);
    return (
      <div className="main">
        <div className="header">
          <div className="headerSection-left">
            <div className="headerItem">Memorise!</div>
          </div>
          <div className="headerSection-right">
            <div className="headerItem">{title}</div>
            <div className="headerItem">{this.state.name}</div>
            {logOut}
          </div>
        </div>
        {content}
        {modal}
      </div>
    );
  }
}