import React, { Component} from 'react'
import GGEditor, { Flow } from 'gg-editor';
import {
  FlowToolbar
 } from '../components/Toolbar/';

import {
  FlowContext
} from '../components/Context';


import Mini from '../components/Mini';
import ItemBar from '../components/ItemBar/Flow';

class App extends Component {
  constructor(){
    super();
    this.state = {
      isInit: false, 
      data: {
        nodes: [],
        edges: []
      }     
    }
  }
  componentDidMount(){
    let graph = this.refs.flow.graph;
    let that = this;
    console.log(graph);
    graph.on('afterchange', (e) => {
      that.props.update(graph.save());
      let baseImg = graph._cfg._canvas._cfg.el.toDataURL("image/png");
      that.props.getBase64(baseImg);
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.isInit && nextProps.chart) {
      this.setState({
        isInit: true,
        data: nextProps.chart
      })
      if (this.refs.mind) {
        this.refs.mind.graph.read(nextProps.chart);
      }
    }
  }

  render() {
    return (  
      <GGEditor className="chart-edit-canvas">
        <FlowToolbar />
        <div className="flex-row">
          <ItemBar/>
          <Flow  className="edit-canvas"
                ref="flow"
                style={{ width: 1140, height: 500 }} 
                data={this.state.data} />
          <div>
            <Mini/>
          </div>
        </div>
        <FlowContext />
      </GGEditor>
    )
  }
}

export default App;
