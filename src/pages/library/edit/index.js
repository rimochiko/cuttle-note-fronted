import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';

class Page extends Component {
    constructor () {
        super();
        this.state = {
          articleContent: '1111'
        }
        this.addBoldStyle = this.addBoldStyle.bind(this);
    }
    /**
     * 添加文字样式 
     * */
    addTextStyle (command) {
      let editBox = this.refs.editBox;
      editBox.focus();
      let selection = window.getSelection();
      let range = selection.getRangeAt(0);

      switch(command){
        case "bold": 
          document.execCommand('bold',false,null);
          break;
        case "italic": 
          console.log(document.execCommand('italic',false,null));
          break;
        case "link": 
          let url  = '';
          if(url) 
            document.execCommand("createlink",false,url);
          break;
			}
    }

    addBoldStyle () {
      let editBox = this.refs.editBox;
      editBox.focus();
      console.log(document.execCommand('bold',false,null));
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
          <div className="page">
          <Sidebar />
            <div className="flex-row overflow flex-1">
            <Modal title="添加链接">
              <div className="edit-link-body">
                <div className="input-group">
                  <label>名称</label>
                  <input type="text" />
                </div>
                <div className="input-group">
                  <label>链接</label>
                  <input type="text" />
                </div>
                <div className="input-group">
                  <button className="radius-btn input-btn">确定</button>
                </div>
              </div>
              
            </Modal>
            <div className="edit-page flex-1">
              <div className="edit-header">
                <input type="text" placeholder="输入文章标题" className="title"/>
                <div className="edit-tool">
                  <ul className="ul-tool">
                    <li>
                      <div
                        className="single-tool" 
                        title="粗体"
                        onClick={this.addTextStyle.bind(this, 'bold')}
                        >
                        <FontAwesomeIcon icon="bold"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="斜体"
                        onClick={this.addTextStyle.bind(this, 'italic')}>
                        <FontAwesomeIcon icon="italic"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="无序列表"
                        onClick={this.addTextStyle.bind(this, 'listul')}>
                        <FontAwesomeIcon icon="list-ul"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="有序列表"
                        onClick={this.addTextStyle.bind(this, 'listol')}>
                        <FontAwesomeIcon icon="list-ol"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool heading" 
                        >
                        <FontAwesomeIcon title="标题" icon="heading"/>
                        <div className="heading-menu">
                          <h1 onClick={this.addTextStyle.bind(this, 'title', 1)}>一级标题</h1>
                          <h2 onClick={this.addTextStyle.bind(this, 'title', 2)}>二级标题</h2>
                          <h3 onClick={this.addTextStyle.bind(this, 'title', 3)}>三级标题</h3>
                          <h4 nClick={this.addTextStyle.bind(this, 'title', 4)}>四级标题</h4>
                        </div>
                      </div>

                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="链接"
                        onClick={this.addTextStyle.bind(this, 'link')}>
                        <FontAwesomeIcon icon="link"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="引用"
                        onClick={(e, command) =>
                          {this.addTextStyle(e, 'quote')}
                        }>
                        <FontAwesomeIcon icon="quote-left"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="代码"
                        onClick={(e, command) =>
                          {this.addTextStyle(e, 'code')}
                        }>
                        <FontAwesomeIcon icon="code"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="图片"
                        onClick={(e, command) =>
                          {this.addTextStyle(e, 'image')}
                        }>
                        <FontAwesomeIcon icon="image"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="撤销"
                        onClick={(e, command) =>
                          {this.addTextStyle(e, 'undo')}
                        }>
                        <FontAwesomeIcon icon="undo"/>
                      </div>
                    </li>
                  </ul>
                  <ul className="ul-tool">
                    <li>
                      <div className="single-tool" 
                           title="Markdown语法">
                           <FontAwesomeIcon icon={['fab','markdown']}/>
                      </div>
                    </li>
                    <li>
                      <div className="single-tool" 
                           title="全屏模式">
                           <FontAwesomeIcon icon="expand-arrows-alt"/>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="edit-body" contentEditable ref="editBox">
                
              </div>
              <div className="edit-footer">
                <p>最近一次保存 2019年3月1日 11:00</p>
                <div className="btns-box">
                  <button className="radius-btn input-btn">保存到草稿箱</button>
                  <button className="radius-btn input-btn">发布</button>
                </div>
              </div>
            </div>
            
              <div className="flex-column">
                <div className="edit-menu">
                  <h1 className="section-title">结构</h1>
                </div>
                <div className="edit-tags">
                  <h1 className="section-title">标签</h1>
                </div>
              </div>
                
            </div>
          </div>
        );
    }
}

export default Page;