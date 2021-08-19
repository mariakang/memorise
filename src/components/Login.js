import React from 'react';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export default class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      form: "login",
      name: "",
      nameValid: false,
      email: "",
      emailValid: false,
      password: "",
      passwordValid: false,
      confirmPassword: "",
      passwordsMatch: false,
      verificationCode: "",
      verificationCodeValid: false
    };
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleChangeFormToRegistration = this.handleChangeFormToRegistration.bind(this);
    this.handleChangeFormToVerification = this.handleChangeFormToVerification.bind(this);
    this.handleChangeFormToLogin = this.handleChangeFormToLogin.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handleVerificationCode = this.handleVerificationCode.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
  }

  handleChangeForm(form) {
    this.setState({
      form: form,
    });
    console.log("form changed to " + this.state.form);
  }

  handleChangeFormToRegistration(event) {
    this.handleChangeForm("registration");
  }

  handleChangeFormToVerification(event) {
    this.handleChangeForm("verification");
  }

  handleChangeFormToLogin(event) {
    this.handleChangeForm("login");
  }

  handleChangeName(event) {
    let newValue = event.target.value;
    let valid = /^[A-Za-z]+[A-Za-z\-\s]*$/.test(newValue);
    this.setState({
      name: newValue,
      nameValid: valid
    });
    console.log("name changed to " + this.state.name + " (valid: " + this.state.nameValid + ")");
  }

  handleChangeEmail(event) {
    let newValue = event.target.value;
    let valid = /^[A-Za-z0-9]+[A-Za-z0-9\-_@.]*$/.test(newValue);
    this.setState({
      email: newValue,
      emailValid: valid
    });
    console.log("email changed to " + this.state.email + " (valid: " + this.state.emailValid + ")");
  }

  handleChangePassword(event) {
    let newValue = event.target.value;
    let valid = newValue.length >= 8 && /[0-9]+/.test(newValue) && /[A-Z]+/.test(newValue) && /[a-z]+/.test(newValue) && /[^0-9A-Za-z]+/.test(newValue);
    let match = newValue === this.state.confirmPassword;
    this.setState({
      password: newValue,
      passwordValid: valid,
      passwordsMatch: match
    });
    console.log("password changed to " + this.state.password + " (valid: " + this.state.passwordValid + ", match: " + this.state.passwordsMatch + ")");
  }

  handleConfirmPassword(event) {
    let newValue = event.target.value;
    let match = newValue === this.state.password;
    this.setState({
      confirmPassword: newValue,
      passwordsMatch: match
    });
    console.log("password confirmation changed to " + this.state.confirmPassword + "(match: " + this.state.passwordsMatch + ")");
  }
  
  handleVerificationCode(event) {
    let newValue = event.target.value;
    let valid = /^[0-9]{6}$/.test(newValue);
    this.setState({
      verificationCode: newValue,
      verificationCodeValid: valid
    });
    console.log("verification code changed to " + this.state.verificationCode + " (valid: " + this.state.verificationCodeValid + ")");
  }

  handleRegister(event) {
    let emailData = {
      Name: 'email',
      Value: this.state.email
    };
    let nameData = {
      Name: 'name',
      Value: this.state.name
    };
    let emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);
    let nameAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(nameData);

    let username = this.state.email.replace('@', '-at-');
    this.props.userPool.signUp(username, this.state.password, [emailAttribute, nameAttribute], null,
      function signUpCallback(err, result) {
        if (!err) {
          console.log('Username is ' + result.user.getUsername());
        } else {
          alert(err.message || JSON.stringify(err));
        }
      }
    );
    this.handleChangeForm("verification");
  }
  
  handleLogin(event) {
    let username = this.state.email.replace('@', '-at-');

    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: this.state.password
    });

    let cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: this.props.userPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function signinSuccess() {
        console.log('Successfully logged in');
        window.location.href = 'index.html';
      },
      onFailure: function signinError(err) {
        alert(err.message || JSON.stringify(err));
      }
    });
  }
  
  handleVerify(event) {
    let username = this.state.email.replace('@', '-at-');
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: username,
      Pool: this.props.userPool
    });
    cognitoUser.confirmRegistration(this.state.verificationCode, true,
      function verificationCallback(err, result) {
        if (!err) {
          console.log('User has been verified');
        } else {
          alert(err.message || JSON.stringify(err));
        }
      }
    );
    this.handleChangeForm("login");
  }

  render() {
    let form = this.state.form;
    let emailAndPasswordValid = this.state.emailValid && this.state.passwordValid;
    let nameValidAndPasswordsMatch = this.state.nameValid && this.state.passwordsMatch;
    let emailAndVerificationCodeValid = this.state.emailValid && this.state.verificationCodeValid;
    let submitButton = 
      form === "login"
        ? (<button onClick={this.handleLogin} disabled={!emailAndPasswordValid}>Log in</button>)
        : form === "registration"
          ? (<button onClick={this.handleRegister} disabled={!emailAndPasswordValid || !nameValidAndPasswordsMatch}>Register</button>)
          : (<button onClick={this.handleVerify} disabled={!emailAndVerificationCodeValid}>Verify</button>);
    let name = null;
    let confirmPassword = null;
    if (form === "registration") {
      name = (
        <div className="row">
          <label>Name: </label>
          <input type="text" name='name' placeholder="Name" onChange={this.handleChangeName} className={this.state.nameValid ? "valid" : "invalid"} value={this.state.name}></input>
        </div>
      );
      confirmPassword = (
        <div className="row">
          <label>Confirm password: </label>
          <input type="password" name='confirmPassword' placeholder='********' onChange={this.handleConfirmPassword} className={this.state.passwordsMatch ? "valid" : "invalid"} value={this.state.confirmPassword}></input>
        </div>
      );
    }
    let passwordOrVerificationCode =
      form === "verification"
        ? (
            <div className="row">
              <label>Verification code: </label>
              <input type="text" name='verificationCode' placeholder='123456' onChange={this.handleVerificationCode} className={this.state.verificationCodeValid ? "valid" : "invalid"} value={this.state.verificationCode}></input>
            </div>
          )
        : (
            <div className="row">
              <label>Password: </label>
              <input type="password" name='password' placeholder='********' onChange={this.handleChangePassword} className={this.state.passwordValid ? "valid" : "invalid"} value={this.state.password}></input>
            </div>
          );
    let links =
      form === "login"
        ? (
            <div className="row">
              <button className="link" onClick={this.handleChangeFormToRegistration}>Register</button>
              <button className="link" onClick={this.handleChangeFormToVerification}>Verify Account</button>
            </div>
          )
        : (
            <div className="row">
              <button className="link" onClick={this.handleChangeFormToLogin}>Cancel</button>
            </div>
          );

    return (
      <div className="loginContainer">
        <h1>Memorise!</h1>
        <p className="blurb">Create lists of things you want to learn and test yourself!</p>
        {name}
        <div className="row">
          <label>Email: </label>
          <input type="text" name='email' placeholder='username@example.com' onChange={this.handleChangeEmail} className={this.state.emailValid ? "valid" : "invalid"} value={this.state.email}></input>
        </div>
        {passwordOrVerificationCode}
        {confirmPassword}
        {submitButton}
        {links}
      </div>
    );
  }
}
