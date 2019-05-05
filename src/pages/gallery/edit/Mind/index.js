import React, { Component, PropTypes } from 'react'
import GGEditor, { Mind } from 'gg-editor';
import {
  MindToolbar
 } from '../components/Toolbar/';

class App extends Component {
  constructor(){
    super();
    this.state = {     
        roots: [{
            label: '中心主题',
            children: [
                {
                    label: '分支主题 1',
                }, 
                {
                    label: '分支主题 2',
                }, 
                {
                    label: '分支主题 3',
                }
            ]
        }]
    }
  }
  componentDidMount(){
    console.log(this);
  }
  render() {
    return (        
      <GGEditor className="chart-edit-canvas">
        <MindToolbar />
        <Mind  className="edit-canvas"
               style={{ width: 1360, height: 500 }} 
               data={this.state.data} />
      </GGEditor>
    )
  }
}

export default App;
