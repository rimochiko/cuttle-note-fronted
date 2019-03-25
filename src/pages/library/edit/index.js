import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from './config.js';
import { format } from 'path';

class Page extends Component {
    constructor () {
        super();
        this.addTextStyle = this.addTextStyle.bind(this);
        this.state = {
          articleContent: '1111'
        }
    }
    /**
     * 添加文字样式 
     * */
    addTextStyle (e, command) {
      e.preventDefault();
      let editBox = this.refs.editBox;
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);
      
      console.log(editBox.document);
      switch(command){
				case "bold": document.execCommand("bold",false,null);break;
				case "italic": document.execCommand("italic",false,null);break;
        case "link": 
          let url = prompt("输入指向的网址");
          if(url) 
				  document.execCommand("createlink",false,url);		
			}
    }

    textStyleCommand (e, command) {
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
            <div className="edit-page flex-1">
              <div className="edit-header">
                <input type="text" placeholder="输入文章标题" className="title"/>
                <div className="edit-tool">
                  <ul className="ul-tool">
                  {
                    config.tool.map((item, index) => {
                      return (
                        <li key={item.id}>
                          <a href="#"
                             onClick={(e, command) =>
                               {this.addTextStyle(e, item.name)}
                             }
                          >
                             <FontAwesomeIcon icon={item.icon}/>
                          </a>
                        </li>
                      )
                    })
                  }
                  </ul>
                  <ul className="ul-tool">
                    <li><a href="#"><FontAwesomeIcon icon={['fab','markdown']}/></a></li>
                    <li><a href="#"><FontAwesomeIcon icon="expand-arrows-alt"/></a></li>
                  </ul>
                </div>
              </div>
              <div className="edit-body" contentEditable="true" ref="editBox">
                {this.state.articleContent}
              </div>
              <div className="edit-footer">
                <p>最近一次保存 2019年3月1日 11:00</p>
                <div className="btns-box">
                  <button className="radius-btn input-btn">保存到草稿箱</button>
                  <button className="radius-btn input-btn">发布</button>
                </div>
              </div>
            </div>
        );
    }
}

export default Page;