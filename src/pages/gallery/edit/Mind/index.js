import React, { Component } from 'react'
import GGEditor, { Mind } from 'gg-editor';
import {
  MindToolbar
 } from '../components/Toolbar/';

class App extends Component {
  constructor(){
    super();
    this.state = {     
        isInit: false,
        data: {
          roots: [{
            label: '中心主题',
            children: []
          }]
        }
    }
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

  componentWillMount() {
    this.setState({
      data: this.props.chart
    })
  }

  componentDidMount(){
    let graph = this.refs.mind.graph;
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
        <MindToolbar />
        <Mind  className="edit-canvas"
               ref="mind"
               style={{ width: 1360, height: 500 }} 
               data={this.state.data} />
      </GGEditor>
    )
  }
}

export default App;
