import React, {Component} from 'react';
import './App.css';
import LoginView from './screens/loginView';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      apiResponse: "" 
    };
  }

  componentWillMount() {
    this.callAPI();
  }

  // fetch users data from api and store res in state. 
  callAPI() {
      fetch("http://localhost:9000/users")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }))
          .catch(err => err);
  }

  render(){
      let {apiResponse} = this.state;
      return (
            <div className="App">
              <LoginView/>
              {apiResponse} 
            </div>
        );  
    }
}

export default App;
