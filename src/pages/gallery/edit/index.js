import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import { Link } from 'react-router-dom';

class Page extends Component {
    constructor () {
        super();
    }

    componentDidMount () {
      this.drawShape(this.refs.caText, 'text', {
        text: 'T',
        style: 'bold 35px Arial',
        x: 0,
        y: 0
      })
      this.drawShape(this.refs.caRound, 'round', {
        radius: 15,
        width: 50,
        height: 50
      });
    }

    // 绘制图形
    drawShape (cvs, type, args) {
      let ctx = cvs.getContext('2d');
      ctx.lineWidth=1;
      ctx.strokeStyle='black';
      console.log(cvs);
      switch (type) {
        case "round": 
          this.drawRound(ctx, args);
          break;
        case "text":
          this.drawText(ctx, args);
      }
    }
    
    // 绘制圆形
    drawRound (ctx, args) {
      let x = args.width / 2;
      let y = args.height / 2;
      ctx.beginPath();
      ctx.arc(x, y, args.radius, 0, 2*Math.PI, true);
      ctx.closePath();
      ctx.stroke();
    }

    // 绘制文字
    drawText (ctx, args) {
      ctx.font = args.style || 'bold 35px Arial';
      ctx.textAlign = args.align || 'center';
      ctx.textBaseline = args.baseline || 'bottom';
      ctx.fillStyle = args.fill || '#ccc';
      ctx.strokeText(args.text, args.x, args.y);
      ctx.fillText(args.text, args.x, args.y)
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
                  <ul className="ul-chart-shape">
                    <span className="section-title">基本图形</span>
                    <li>
                      <canvas width="50" height="50" ref="caText" shapename="text"></canvas>
                      <canvas width="50" height="50" ref="caRound" shapename="round"></canvas>
                    </li>
                  </ul>
                </div>
                <div className="chart-edit-canvas flex-1">
                  <div className="edit-canvas"></div>
                </div>
              </div>
              
            </div>
          </div>
        );
    }
}

export default Page;