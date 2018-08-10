import React, { Component } from 'react';
import './App.css';
import './css/bootstrap.min.css'

// Functional Components
function Graph(props) {
  if (props.data.edges && props.data.vertices) {
    const vertices = props.data.vertices;
    const edgeMatrix = props.data.edges;

    const verticesList = vertices.map((vertice) => {
      return <Vertice data={vertice} ref={React.createRef()}/>
    });

    var edges = [];
    for (var i = 0; i < edgeMatrix.length; i++) {
      var startVertice = verticesList[i];
      for (var j = 0; j < edgeMatrix[i].length; j++) {
        var endVertice = verticesList[j];
        edges.push(<Edge startVertice={startVertice.ref.current} endVertice={endVertice.ref.current}></Edge>);
      }
    }

    return (
      <div>
        <div className='row'>
          {verticesList}
        </div>
          {edges}
      </div>
    );
  } else {
    return null;
  }
}

class Vertice extends Component {
  constructor(props) {
    super(props);
    this.div = null;
  }

  render() {
    return (
      <div className='col-sm-3'>
        <div className='vertice card w-75' ref={ele => this.div = ele}>
          <div className='card-body'>
            <div className='card-title'>{this.props.data.name}</div>
            <div className='card-text'>{this.props.data.desc}</div>
          </div>
        </div>
      </div>
    )
  }
}

class Edge extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    if (this.props.startVertice && this.props.endVertice) {
      console.log(this.props.startVertice.ref)
      var tail = this.props.startVertice.div.getBoundingClientRect();
      var head = this.props.endVertice.div.getBoundingClientRect();
      return (
        <svg className='Edge'>
          <line x1={tail.x} y1={tail.y} x2={head.x} y2={head.y} />
        </svg>
      );
    } else {
      return null;
    }
  }
}

class App extends Component {
  state = {
    response: {}
  };

  componentDidMount() {
    this.callApi('graph')
      .then(res => this.setState({
        response: res.express
      }))
      .catch(err => console.log(err));
  }

  callApi = async(route) => {
    const response = await fetch('/api/' + route);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  render() {
    return (
      <div className='App container-fluid'>
        <div className='row'>
          <div className='col'>
            <h1 className='App-header'>Welcome to the Doki Doki Lit Solver!</h1>
          </div>
        </div>
        <Graph data={this.state.response}/>
      </div>
    );
  }
}

export default App;
