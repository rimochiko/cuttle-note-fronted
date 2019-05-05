import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import { Link } from 'react-router-dom';
import G6 from '@antv/g6';
const Minimap = require('@antv/g6/build/grid');

class Page extends Component {
    constructor () {
        super();
        this.state = {
          graph: null,
          textEdit: {
            x: 0,
            y: 0,
            status: 0,
            id: null
          },
          canvasPos: {
            x: 0,
            y: 0
          },
          data: {
            nodes: [{
              id: 'customer',
              label: 'customer',
              x: 200,
              y: 200,
              shape: 'rect',
              size: [60, 40]
          }, {
              id: 'customer_id',
              label: 'customer_id',
              x: 120,
              y: 160,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'name',
              label: 'name',
              x: 140,
              y: 100,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'address',
              label: 'address',
              x: 180,
              y: 60,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'email',
              label: 'email',
              x: 240,
              y: 110,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'order',
              label: 'order',
              x: 400,
              y: 200,
              shape: 'rect',
              size: [60, 40]
          }, {
              id: 'order_id',
              label: 'order_id',
              x: 320,
              y: 130,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'order_status',
              label: 'order_status',
              x: 380,
              y: 80,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'total_price',
              label: 'total_price',
              x: 440,
              y: 150,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'employee',
              label: 'employee',
              x: 380,
              y: 380,
              shape: 'rect',
              size: [60, 40]
          }, {
              id: 'employee_id',
              label: 'employee_id',
              x: 320,
              y: 440,
              shape: 'ellipse',
              size: [80, 40]
          }, {
              id: 'title',
              label: 'title',
              x: 440,
              y: 440,
              shape: 'ellipse',
              size: [80, 40]
          }],
            edges: [{
              id: 'c_id',
              source: 'customer',
              target: 'customer_id'
          }, {
              id: 'c_name',
              source: 'customer',
              target: 'name'
          }, {
              id: 'c_address',
              source: 'customer',
              target: 'address'
          }, {
              id: 'c_email',
              source: 'customer',
              target: 'email'
          }, {
              id: 'o_id',
              source: 'order',
              target: 'order_id'
          }, {
              id: 'o_price',
              source: 'order',
              target: 'total_price'
          }, {
              id: 'o_status',
              source: 'order',
              target: 'order_status'
          }, {
              id: 'c_o',
              source: 'customer',
              target: 'order',
              relation: 'places',
              sourceEntity: '1',
              targetEntity: 'N',
              shape: 'relation'
          }, {
              id: 'o_e',
              source: 'employee',
              target: 'order',
              relation: 'finalize',
              sourceEntity: '1',
              targetEntity: 'N',
              shape: 'relation'
          }, {
              id: 'e_id',
              source: 'employee',
              target: 'employee_id'
          }, {
              id: 'e_title',
              source: 'employee',
              target: 'title'
          }]
          }
        }
    }
    setTextEditPosition(x, y, text, id,status) {
      if (status === 0) {
        this.refs.textTool.innerHTML = '';
        this.setState({
          textEdit: {
            x: 0,
            y: 0,
            status: 0,
            id: null
          }
        });
      } else {
        this.refs.textTool.innerHTML = text;
        let width = this.refs.textTool.clientWidth,
        height = this.refs.textTool.clientHeight;
        console.log(width, height)
        this.setState({
          textEdit: {
            x: x,
            y: y,
            status: 1,
            id: id
          }
        });
      }
      console.log(this.state);
    }

    // 文字编辑完毕
    textToolBlur () {
      // 更新data
      let data = this.state.data.nodes.slice(0);
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].id === this.state.textEdit.id) {
          data[i].label = this.refs.textTool.innerText;
          break;
        }
      }
      this.setState({
        data: {
          nodes: data,
          edges: this.state.data.edges
        },
        textEdit: {
          x: 0,
          y: 0,
          status: 0,
          id: null
        }
      })
      this.state.graph.changeData(this.state.data);
    }

    // 获取canvas的边距
    getCanvasPos () {
      this.setState({
        x: this.refs.editGraph.offsetLeft,
        y: this.refs.editGraph.offsetTop
      });
    }

    componentWillMount () {
      let that = this;
      G6.registerBehavior('text-node', {
        getEvents() {
          return {
            'node:dblclick': 'onDbClick',
          };
        },
        onDbClick(e) {
          const graph = this.graph;
          console.log(graph);
          const item = e.item;
          const modal = item.getModel();
          console.log(item);
          that.setTextEditPosition(
            modal.x,
            modal.y,
            modal.label,
            modal.id,
            1
          )
          that.refs.textTool.focus();
        }
      });

      // 封装点击添加边的交互
      G6.registerBehavior('click-add-edge', {
        getEvents() {
          return {
            'node:click': 'onClick' , 
            mousemove: 'onMousemove'
          };
        },
        onClick(ev) {
          const node = ev.item;
          const graph = this.graph;
          const point = {x: ev.x, y: ev.y};
          const model = node.getModel();
          // 如果在添加边的过程中，再次点击另一个节点，结束边的添加
          if (this.addingEdge && this.edge) {
            graph.updateItem(this.edge, {
              target: model.id
            });
            this.edge = null;
            this.addingEdge = false;
          } else {
            // 点击节点，触发增加边
            this.edge = graph.addItem('edge', {
              source: model.id,
              target: point
            });
            this.addingEdge = true;
          }
        },
        onMousemove(ev) {
          const point = {x: ev.x, y: ev.y};
          if (this.addingEdge && this.edge) {
            // 增加边的过程中，移动时边跟着移动
            this.graph.updateItem(this.edge, {
              target: point
            });
          }
        }
      });
    }

    componentDidMount () {
      const minimap = new Minimap();

      const graph = new G6.Graph({
        container: 'edit-graph',
        width: 1020,
        height: 600,
        plugins: [ minimap ],
        modes: {
          default: ['drag-canvas', 'zoom-canvas'],
          edit: ['drag-canvas', 
                 'drag-node',  
                 'text-node']
        }
      });

      graph.changeData(this.state.data);
      graph.setMode('edit');
      this.setState({
        graph: graph
      })
      this.getCanvasPos();
    }


    render () {
        return (
          <div className="flex-row overflow">
          <Sidebar />
            <div className="flex-column flex-1 edit-chart-page">
              <div className="chart-edit-header">
                <input type="text" placeholder="标题" className="edit-input"/>
                <div className="btns-box">
                  <button className="radius-btn sub-btn">保存草稿</button>
                  <button className="radius-btn input-btn">发布</button>
                </div>
              </div>
              <div className="chart-edit-tools">
                <ul className="ul-chart-tools">
                  <li title="上一步">
                    <FontAwesomeIcon icon="undo-alt"/>
                  </li>
                  <li title="下一步">
                    <FontAwesomeIcon icon="redo-alt"/>
                  </li>
                  <li title="字体">
                    <span>微软雅黑</span>
                  </li>
                  <li title="字大小">
                    <span>12</span>
                  </li>
                  <li title="加粗">
                    <FontAwesomeIcon icon="bold"/>
                  </li>
                  <li title="下划线">
                    <FontAwesomeIcon icon="underline" />
                  </li>
                  <li title="字颜色">
                    <FontAwesomeIcon icon="tint" />
                  </li>
                  <li title="左对齐">
                    <FontAwesomeIcon icon="align-left" />
                  </li>
                  <li title="居中对齐">
                    <FontAwesomeIcon icon="align-center" />
                  </li>
                  <li title="右对齐">
                    <FontAwesomeIcon icon="align-right" />
                  </li>
                  <li title="线条类型">
                    <FontAwesomeIcon icon="exchange-alt" />
                  </li>
                  <li title="向上一层">
                    <FontAwesomeIcon icon="level-up-alt" />
                  </li>
                  <li title="向下一层">
                    <FontAwesomeIcon icon="level-down-alt" />
                  </li>
                  <li title="锁定">
                    <FontAwesomeIcon icon="lock" />
                  </li>
                  <li title="解锁">
                    <FontAwesomeIcon icon="unlock-alt" />
                  </li>
                </ul>
              </div>
              <div className="flex-row flex-1 overflow">
                <div className="chart-edit-shapes">
                    <ul className="chart-shape-group">
                      <li className="shape"
                          onClick={this.addRect.bind(this)}>
                       <img src={require('../../../assets/images/tool/rec.svg')} alt="矩形"/>
                      </li>
                      <li className="shape"
                          onClick={this.addCircle.bind(this)}>
                        <img src={require('../../../assets/images/tool/circle.svg')} alt="圆形"/>
                      </li>
                      <li className="shape"
                          onClick={this.addEllips.bind(this)}>
                        <img src={require('../../../assets/images/tool/ellip.svg')} alt="椭圆"/>
                      </li>
                    </ul>                    
                </div>
                <div className="chart-edit-canvas">
                  <div className="edit-canvas" id="edit-graph" ref="editGraph">
                    <div contentEditable 
                      ref="textTool"
                      id="text-tool"
                      onBlur={this.textToolBlur.bind(this)} 
                      style={{
                          left: this.state.textEdit.x + 'px', 
                          top: this.state.textEdit.y + 'px',
                          display: this.state.textEdit.status === 0 ? 'none' : 'block'
                    }}></div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        );
    }
}

export default Page;