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
      this.drawBackground(this.refs.caMain);

      this.drawShape(this.refs.caText, 'text', {
        text: 'Text',
        style: 'bold 16px Arial',
        x: 25,
        y: 35
      });
      this.drawShape(this.refs.caRound, 'round', {
        radius: 15,
        width: 50,
        height: 50
      });
      this.drawShape(this.refs.caRectangle, 'rect', {
        x: 10,
        y: 15,
        width: 30,
        height: 20
      });
      this.drawShape(this.refs.caNote, 'note', {
        x: 15,
        y: 13,
        width: 20,
        height: 26
      });
      this.drawShape(this.refs.caTriangle, 'triangle', {
        x1: 25,
        y1: 10,
        x2: 10,
        y2: 20,
        x3: 40,
        y3: 20
      });
      this.drawShape(this.refs.caRoundRect, 'roundRect', {
        x: 10,
        y: 15,
        width: 30,
        height: 20 
      });
    }

    // 绘制背景
    drawBackground (cvs) {
      let ctx = cvs.getContext('2d');
      ctx.lineWidth=0.5;
      ctx.strokeStyle="#E8E8E8";

      // 绘制竖线
      var x=0,y=0;
      for(var i=0;i<=68;i++)
      {
        if (i%4===0) {
          ctx.lineWidth=1
        } else {
          ctx.lineWidth=0.5;
        }
        x=i*15;
        y=0;
        ctx.beginPath();
        ctx.moveTo(x,y);
        y=1020;
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.closePath();
      }
      // 绘制横线
      for(var j=0;j<=45;j++)
      {
        if (j%4===0) {
          ctx.lineWidth=1
        } else {
          ctx.lineWidth=0.5;
        }
        x=0;
        y=j*15;
        ctx.beginPath();
        ctx.moveTo(x,y);
        x=1020;
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.closePath();
      }

    }

    // 绘制图形
    drawShape (cvs, type, args) {
      let ctx = cvs.getContext('2d');
      ctx.lineWidth=1;
      
      switch (type) {
        case "round": 
          this.drawRound(ctx, args);
          break;
        case "text":
          this.drawText(ctx, args);
          break;
        case 'rect':
          this.drawRectangle(ctx, args);
          break;
        case 'note':
          this.drawNote(ctx, args);
          break;
        case "triangle": 
          this.drawTriangle(ctx, args);
          break;
        case 'roundRect':
          this.drawRoundRect(ctx, args);
          break;
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

    // 绘制矩形
    drawRectangle (ctx, args) {
      ctx.fillStyle = args.fill || '#fff';
      ctx.strokeStyle = args.stroke || 'black';
      ctx.rect(args.x, args.y, args.width, args.height);
      ctx.fillRect(args.x, args.y, args.width, args.height);
      ctx.stroke();
    }
    
    // 绘制便签
    drawNote (ctx, args) {
      ctx.fillStyle = args.fill || '#ffffaa';
      ctx.strokeStyle = args.stroke || 'black';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(args.x, args.y);
      ctx.lineTo(args.x + args.width - 5, args.y);
      ctx.lineTo(args.x + args.width, args.y + 5);
      ctx.lineTo(args.x + args.width, args.y + args.height);
      ctx.lineTo(args.x , args.y + args.height);
      ctx.lineTo(args.x, args.y);
      ctx.closePath();
      ctx.stroke();
    }

    // 绘制文字
    drawText (ctx, args) {
      ctx.font = args.style || 'bold 12px Arial';
      ctx.textAlign = args.align || 'center';
      ctx.textBaseline = args.baseline || 'bottom';
      ctx.fillStyle = args.fill || '#000';
      ctx.strokeText(args.text, args.x, args.y);
      // ctx.fillText(args.text, args.x, args.y)
    }

    // 绘制圆角矩形
    drawRoundRect (ctx, args) {
      ctx.fillStyle = args.fill || '#fff';
      ctx.strokeStyle = args.stroke || 'black';
      let x = args.x,
          y = args.y,
          height = args.height,
          width = args.width,
          radius = 3;
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
      ctx.lineTo(width - radius + x, y);
      ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
      ctx.lineTo(width + x, height + y - radius);
      ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
      ctx.lineTo(radius + x, height +y);
      ctx.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
      ctx.closePath();
      ctx.stroke();
    }
    
    // 绘制三角形
    drawTriangle (ctx, args) {
      ctx.beginPath();
      ctx.moveTo(args.x1, args.y1);
      ctx.lineTo(args.x2, args.y2);
      ctx.lineTo(args.x3, args.y3);
      ctx.lineTo(args.x1, args.y1);
      ctx.closePath();
      ctx.stroke();
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
                  <div className="chart-shape-group">
                    <span className="section-title">基本图形</span>
                    <canvas width="50" height="50" ref="caText" shapename="text"></canvas>
                    <canvas width="50" height="50" ref="caNote" shapename="note"></canvas>
                    <canvas width="50" height="50" ref="caRound" shapename="round"></canvas>
                    <canvas width="50" height="50" ref="caRectangle" shapename="rectangle"></canvas>
                    <canvas width="50" height="50" ref="caRoundRect" shapename="roundRectangle"></canvas>
                    <canvas width="50" height="50" ref="caTriangle" shapename="triangle"></canvas>
                    <canvas width="50" height="50" ref="caDiamond" shapename="diamond"></canvas>
                    <canvas width="50" height="50" ref="caCloud" shapename="cloud"></canvas>
                    <canvas width="50" height="50" ref="caDialog" shapename="dialog"></canvas>
                  </div>
                    
                </div>
                <div className="chart-edit-canvas flex-1">
                  <div className="edit-canvas">
                    <canvas width="1020" height="600" ref="caMain"></canvas>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        );
    }
}

export default Page;