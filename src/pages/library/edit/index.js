import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import Tabs from '../../../components/tabs';
import { Link } from 'react-router-dom';

const TabPane = Tabs.TabPane;

class Page extends Component {
    constructor () {
        super();
        this.state = {
          articleContent: '1111',
          currentPos: 0,
          currentContainer: null,
          lastSaveTime: 1033
        }
    }

    componentDidMount() {
      console.log(this.props);
    }

    /**
     * 获取选中文本
    */
    getSelectedText () {
      var html = "";
      if (typeof window.getSelection != 'undefined') {
        var select = window.getSelection();
        if (select.rangeCount) {
          let container = document.createElement('div');
          for (var i = 0, len = select.rangeCount; i < len; i++) {
            container.appendChild(select.getRangeAt(i).cloneContents());
          }
          html = container.innerHTML;
        }
      } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
          html = document.selection.createRange().htmlText;
        }
      }
      return html;
    }

    /**
     * 获取鼠标光标所在位置
    */
    getLastCursor (element) {
      console.log('blur');
      let currentPos = 0,
          currentContainer = null;
      if (document.selection) {
        console.log('selection');
        // IE
        let selectRange = document.selection.createRange();
        selectRange.moveStart('character', -element.value.length);
        currentPos = selectRange.text.length;
      } else if (element.selectionStart || element.selectionStart == '0') {
        console.log('selectionStart');
        currentPos = element.selectionStart;
      } else if (window.getSelection) {
        currentPos = window.getSelection().getRangeAt(0).startOffset;
        currentContainer = window.getSelection().getRangeAt(0).commonAncestorContainer;
      }
      console.log(currentPos);
      this.setState({
        currentPos,
        currentContainer
      })
    }

    /**
     * 添加文字样式 
     * */
    addTextStyle (command, args) {
      let editBox = this.refs.editBox;
      // 获取目前editBox所在光标位置
      console.info(this.state.currentPos);
      editBox.focus();

      /*var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      // 光标移动到到原来的位置加上新内容的长度
      range.setStart(this.state.currentContainer, this.state.currentPos)
      // 光标开始和光标结束重叠
      range.collapse(true)
      // 清除选定对象的所有光标对象
      selection.removeAllRanges()
      // 插入新的光标对象
      selection.addRange(range)*/

      switch(command){
        case "bold": 
          document.execCommand('bold',false,null);
          break;
        case "italic": 
          document.execCommand('italic',false,null);
          break;
        case "link": 
          this.refs.addLink.toggle();
          let url="";
          if(url) 
            document.execCommand("createlink",false,url);
          break;
        case "listul": 
          document.execCommand("insertUnorderedList", false);
        break;
        case "listol": 
          document.execCommand("insertOrderedList", false);
        break;
        case "title":
          document.execCommand('formatBlock', false, `<h${args}>`);
        break;
        case "quote":
          document.execCommand('formatBlock', false, '<blockquote>');
          break; 
        case "image": 
          this.refs.addImage.toggle();
        break;
        case "code": 
          document.execCommand('formatBlock', false, '<pre>');
        break;
        case "undo": 
          document.execCommand('Undo');
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
          this.refs.addLink.show();
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
            <Modal title="添加链接" ref="addLink">
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

            <Modal title="添加图片" ref="addImage">
              <div className="edit-link-body">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="本地上传" key="1">
                    <div className="input-group">
                      <label>选择图片</label>
                      <input type="file" />
                    </div>
                    <div className="input-group">
                      <label>图片描述</label>
                      <input type="text" />
                    </div>
                    <div className="input-group">
                      <button className="radius-btn input-btn">上传</button>
                    </div>
                  </TabPane>
                  <TabPane tab="网络获取" key="2">
                    <div className="input-group">
                      <label>图片地址</label>
                      <input type="text" />
                    </div>
                    <div className="input-group">
                      <label>图片描述</label>
                      <input type="text" />
                    </div>
                    <div className="input-group">
                      <button className="radius-btn input-btn">确定</button>
                    </div>
                  </TabPane>
                </Tabs>
              </div>   
            </Modal>

            <div className="edit-page flex-1">
              <div className="edit-header">
                <input type="text" placeholder="输入文章标题" className="title"/>
                <div className="edit-tool">
                  <ul className="ul-tool">
                    <li>
                      <button
                        className="single-tool" 
                        title="粗体"
                        onClick={this.addTextStyle.bind(this, 'bold')}
                        >
                        <FontAwesomeIcon icon="bold"/>
                      </button>
                    </li>
                    <li>
                      <button
                        className="single-tool" 
                        title="斜体"
                        onClick={this.addTextStyle.bind(this, 'italic')}>
                        <FontAwesomeIcon icon="italic"/>
                      </button>
                    </li>
                    <li>
                      <button
                        className="single-tool" 
                        title="无序列表"
                        onClick={this.addTextStyle.bind(this, 'listul')}>
                        <FontAwesomeIcon icon="list-ul"/>
                      </button>
                    </li>
                    <li>
                      <button
                        className="single-tool" 
                        title="有序列表"
                        onClick={this.addTextStyle.bind(this, 'listol')}>
                        <FontAwesomeIcon icon="list-ol"/>
                      </button>
                    </li>
                    <li>
                      <div
                        className="single-tool heading" 
                        >
                        <FontAwesomeIcon title="标题" icon="heading"/>
                        <div className="heading-menu">
                          <button onClick={this.addTextStyle.bind(this, 'title', 1)}><h1>一级标题</h1></button>
                          <button onClick={this.addTextStyle.bind(this, 'title', 2)}><h2>二级标题</h2></button>
                          <button onClick={this.addTextStyle.bind(this, 'title', 3)}><h3>三级标题</h3></button>
                          <button onClick={this.addTextStyle.bind(this, 'title', 4)}><h4>四级标题</h4></button>
                        </div>
                      </div>

                    </li>
                    <li>
                      <button
                        className="single-tool" 
                        title="链接"
                        onClick={this.addTextStyle.bind(this, 'link')}>
                        <FontAwesomeIcon icon="link"/>
                      </button>
                    </li>
                    <li>
                      <button
                        className="single-tool" 
                        title="引用"
                        onClick={this.addTextStyle.bind(this, 'quote')}>
                        <FontAwesomeIcon icon="quote-left"/>
                      </button>
                    </li>
                    <li>
                      <button
                        className="single-tool" 
                        title="代码"
                        onClick={this.addTextStyle.bind(this, 'code')}>
                        <FontAwesomeIcon icon="code"/>
                      </button>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="图片"
                        onClick={this.addTextStyle.bind(this, 'image')}>
                        <FontAwesomeIcon icon="image"/>
                      </div>
                    </li>
                    <li>
                      <div
                        className="single-tool" 
                        title="撤销"
                        onClick={this.addTextStyle.bind(this, 'undo')}>
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
              <div className="edit-body" contentEditable ref="editBox" onBlur={this.getLastCursor.bind(this)}>
                
              </div>
              <div className="edit-footer">
                <p>最近一次保存 {this.state.lastSaveTime}</p>
                <div className="btns-box">
                  <button className="radius-btn sub-btn">保存到草稿箱</button>
                  <button className="radius-btn input-btn">发布</button>
                </div>
              </div>
            </div>
            
              <div className="flex-column edit-side">
                <div className="edit-menu">
                  <div className="section-title">
                    <h1 className="text">文章目录</h1>
                    <Link to="/"><FontAwesomeIcon icon="ellipsis-h" /></Link> 
                  </div>
                  <div className="detail">
                    <Link to="/">我的空间</Link> / <Link to="/">笔记</Link> / <Link to="/">2019-01-23</Link>
                  </div>
                </div>
                <div className="edit-tags">
                  <h1 className="section-title">标签</h1>
                  <input type="text" placeholder="输入标签名..." className="input"/>
                  <ul className="tags">
                    <li>
                      <span>
                        日记
                      </span>
                      <FontAwesomeIcon icon="times" />
                    </li>
                  </ul>
                </div>
              </div>
                
            </div>
          </div>
        );
    }
}

export default Page;