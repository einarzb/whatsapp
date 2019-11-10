import React, {Component} from 'react';
import styled from 'styled-components';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render(){
    return(
      <LoginWrap>
        <form>
          <label>
            Username:
              <input type="text" id="username"></input>
          </label>
          <label>
            Password:
              <input type="text" id="password"></input>
          </label>
          <SubBtn type="submit"> Submit </SubBtn>

        </form>
      </LoginWrap>
    )
  }
}

export default LoginView;

const LoginWrap = styled.div`
  display:inline-flex;
  flex-direction: column;
  align-items:center;
  background-color:#a4c5e2;
  width: 400px;
  height: auto;
  padding: 1rem;
  border-radius: 0.5em;
  & form {
    color: #FFFFFF;
    font-size: 15px;
    width: 100%;
    & label {
      width: 88%;
      text-align: left;
      display: block;
      padding-left: 1rem;
    }
    & input {
      background-color: #f0f8ff;
      opacity: 0.7;
      display: block;
      margin: 10px auto;
      border-radius: 0.5em;
      border: none;
      height: auto;
      width: 80%;
      font-size: 1rem;
      line-height: 2;
    }
  }
`;

const SubBtn = styled.button`
  background-color: #FFFFFF;
  width: 45%;
  height: 30px;
  border-radius: 1em;
  border: none;
  margin: 1rem auto;
  font-size: 14px;
  color:#a4c5e2;
`;