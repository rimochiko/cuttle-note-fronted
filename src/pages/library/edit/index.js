import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from './config.js';
import { format } from 'path';

class Page extends Component {
    constructor () {
        super();
        this.addTextStyle = this.addTextStyle.bind(this);
    }
    /**
     * 添加文字样式 
     * */
    addTextStyle () {

    }

    textStyleCommand (command) {
      var command = {
        bold: function (text) {
          return `**${text}**`
        },
        italic: function (text) {
          return `*${text}*`
        },
        listul: function (text) {
          text.replace(/\n/, '');
          return `- ${text}*`
        },
        listol: function (text) {
          text.split('\n').map((item, index) => {
            return `${index+1}.${item}`;
          })
          return text.join('\n');
        },
        heading: function (text, level) {
          // 待改进
          let front = '';
          for (let i=0; i < level; i++) {
            front+='#';
          }
          return `${front} ${text}`;
        },
        link: function (text, link) {
          
        },
        quote: function (text) {

        },
        code: function (text) {

        },
        image: function (text) {

        },
        markdown: function () {
        }

      }

    }

    render () {
        return (
            <div className="wrapper-edit-page">
              <div className="wrapper-edit-header">
                <input type="text" placeholder="输入文章标题" className="title"/>
                <ul className="wrapper-edit-tool">
                {
                  config.tool.map((item, index) => {
                    return (
                      <li><a href="#" onClick={this.addTextStyle(item.name)}><FontAwesomeIcon icon={item.icon}/></a></li>
                    )
                  })
                }
                </ul>
              </div>
              <div className="wrapper-edit-body" contentEditable="true">
              </div>
              <div className="wrapper-edit-footer">
                <p>收录于 <a href="#" class="text-about"><FontAwesomeIcon icon="info-circle"/>Three.js笔记</a>，最近一次保存 2019年3月1日 11:00</p>
                <div className="btns-box">
                  <button>保存到草稿箱</button>
                  <button className="confirm">发布</button>
                </div>
              </div>
            </div>
        );
    }
}

export default Page;