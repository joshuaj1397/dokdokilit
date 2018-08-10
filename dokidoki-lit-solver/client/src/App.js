import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Functional Components
function Search(props) {

}

function Node(props) {
  return (
    <button className="Node">
      "Placeholder"
    </button>
  );
}

function Edge(props) {
  return (
    <svg class="Edge">
      <line x1="0" y1="0" x2="200" y2="200" />
    </svg>
  )
}

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.get()
      .then(res => this.setState({
        response: res.express
      }))
      .catch(err => console.log(err));
  }

  getNode = async() => {
    const response = await fetch('/api/getNode');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the DokiDoki Lit Solver</h1>
        </header>
        <p className="App-intro">
          {this.state.response}
        </p>
      </div>
    );
  }
}

export default App;
