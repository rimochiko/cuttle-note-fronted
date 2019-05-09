import React, { Component, PropTypes } from 'react'
import GGEditor, { Flow } from 'gg-editor';
import G6 from '@antv/g6';
import {
  FlowToolbar
 } from '../components/Toolbar/';

class App extends Component {
  constructor(){
    super();
    this.state = { 
      data: {
        nodes: [],
        edges: []
      }     
    }
  }
  componentDidMount(){
    console.log(this);
  }

  render() {
    return (  
      <GGEditor className="chart-edit-canvas">
        <FlowToolbar />
        <Flow  className="edit-canvas"
               ref="flow"
               style={{ width: 1360, height: 500 }} 
               data={this.state.data} />
      </GGEditor>
    )
  }
}

export default App;
