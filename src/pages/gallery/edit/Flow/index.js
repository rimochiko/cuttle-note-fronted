import React, { Component, PropTypes } from 'react'
import GGEditor, { Flow, Item } from 'gg-editor';
import G6 from '@antv/g6';
import {
  FlowToolbar
 } from '../components/Toolbar/';
 import ItemBar from '../components/ItemBar/Flow';

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
    let graph = this.refs.flow.graph;
    let that = this;
    graph.on('afterchange', (e) => {
      that.props.update(graph.save());
      let baseImg = graph._cfg._canvas._cfg.el.toDataURL("image/png");
      that.props.getBase64(baseImg);
    })
  }

  render() {
    return (  
      <GGEditor className="chart-edit-canvas">
        <FlowToolbar />
        <div className="flex-row">
          <ItemBar/>
          <Flow  className="edit-canvas"
                ref="flow"
                style={{ width: 1160, height: 540 }} 
                data={this.state.data} />
        </div>

      </GGEditor>
    )
  }
}

export default App;
