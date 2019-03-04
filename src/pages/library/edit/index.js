import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Page extends Component {
    constructor () {
        super();
        this.AddTextStyle = this.AddTextStyle.bind(this);
    }
    /**
     * 添加文字样式 
     * */
    AddTextStyle (command) {
      var command = {
        bold: function (text) {
          return `**${text}**`
        },
        italic: function (text) {
          return `*${text}*`
        },
        listul: function (text) {

        },
        listol: function (text) {

        },
        heading: function (text) {

        },
        link: function (text) {

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
                  <li><a href="#" onClick={this.AddTextStyle('bold')}><FontAwesomeIcon icon="bold"/></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="italic" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="list-ul" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="list-ol" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="heading" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="link" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="quote-left" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="code" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="image" /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon="undo" /></a></li>
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