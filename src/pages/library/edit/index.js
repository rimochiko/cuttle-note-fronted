import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Modal from '../../../components/modal';
import Switch from '../../../components/switch';
import Loading from '../../../components/loading';
import Tooltip from '../../../components/tooltip';

import CodeModal from './components/code';
import ImageModal from './components/image';

import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Qlquery from './graphql';
import TurndownService from 'turndown';
import creatHistory from 'history/createBrowserHistory' 

const history = creatHistory();


const USER = "user",
      GROUP = "group";

const turndownService = new TurndownService();
@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
          isUpdate: false,
          title: '',
          isAuth: 0,
          content: '',
          lastSaveTime: null,
          lastSaveUser: {
            id: '',
            name: ''
          },
          postId: null,
          parentId: null,
          draftId: null,
          space: {
            id: '',
            name: '',
            type: ''
          },
          markdown: '',
          isBold: false,
          isItalic: false,
          isBlockquote: false,
          isCode: false,
          linkName: '',
          linkHref: '',
          tipText: '',
          selectText: '',
          lastEditRange: null,
          changeTimer: null,
          lockTimer: null
        }
        this.generateLink = this.generateLink.bind(this);
        this.generateSaveStatus = this.generateSaveStatus.bind(this);
    }

    async componentDidMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
        return;
      }

      if (this.props.location.query && this.props.location.query.postId) {
        document.title = "编辑文章 - 墨鱼笔记";
        this.setState({
          postId: this.props.location.query.postId
        })
        
        // 如果有postId，说明是编辑文档，要先发送编辑状态，再获取文章
        Qlquery.getOnePost({
          userId: this.props.userStore.user.userId,
          postId: this.state.postId,
          token: this.props.userStore.user.token,
          isUpdate: true
        })
        .then(({data}) => {
          let res = data.data.data;
          if(res.code === 1) {
            // 请求成功
            let space = {
                id: '',
                name: '',
                type: ''            
            };
            let post = res.post;
            if (res.post.belongGroup) {
              space.id = post.belongGroup.id;
              space.name = post.belongGroup.nickname;
              space.type = "group"
            } else {
              space.id = post.author.id;
              space.name = post.author.nickname;
              space.type = "user";
            }
            this.setState({
              title: res.post.title,
              isAuth: res.post.isAuth,
              content: res.post.content,
              lastSaveTime: res.post.recentTime,
              lastSaveUser: res.post.recentUser,
              parentId: res.post.parent,
              space: space,
              isUpdate: true
            })

            // 如果是团队编辑
            if (this.state.space.type === GROUP) {
              this.setState({
                lockTimer: setTimeout(() => {
                  console.log('locker')
                  if (!this.refs.editBox) {
                    clearInterval(this.state.lockTimer);
                    this.setState({
                      lockTimer: null
                    })
                  }
                  this.sendLock();
                }, 15000)
              })
            }

          } else {
            if (res.code === 1) {
              this.showTooltip("文档内容有更新，请重新读取");
            } else if (res.code === 2) {
              this.showTooltip("你的小伙伴正在编辑此文档，请稍后重试");
            } else {
              this.showTooltip("请求文章内容失败");
            }
            setTimeout(() => {
              history.goBack();
            }, 1000);
          }   
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        document.title = "创建新文章 - 墨鱼笔记";
        // 确认是否是创建团队文章
        let space;
        if (this.props.location.query && this.props.location.query.groupId) {
          // 获取团队信息
          space =  {
            id: this.props.location.query.groupId,
            name: this.props.location.query.groupName,
            type: GROUP      
          }
        } else {
          space =  {
            id: this.props.userStore.user.userId,
            name: this.props.userStore.user.nickname,
            type: USER       
          }
        }
        
        this.setState({
          space: space,
          parentId: (this.props.location.query && this.props.location.query.parentId) || null
        });
      }
      this.refs.editBox.innerHTML = (this.state.post && this.state.post.content) || '';
      this.refs.loading.toggle();
    }

    /**
     * 发送加锁信号
     */
    async sendLock () {
      await Qlquery.sendEditStatus({
        userId: this.props.userStore.user.userId,
        postId: this.state.postId,
        token: this.props.userStore.user.token,
        isLock: true 
      })
      .then(({data}) => {
        let res = data.data.data;
        console.log('lockres:' + res);
        if (res !== 0) {
          // 保存一份草稿
          this.saveDraft();
          if (res === 1) {
            this.showTooltip("文档内容有更新，请重新读取");
          } else if (res === 2) {
            this.showTooltip("你的小伙伴正在编辑此文档，请稍后重试");
          } else {
            this.showTooltip("请求文章内容失败");
          }
          setTimeout(() => {
            history.goBack();
          }, 1000);          
        }
      })
    }

    /** 获取选中文字 */
    getSelection () {
      let res = ''
      if (window.getSelection) {
        let se = window.getSelection()
        let start = se.anchorOffset;
        let  end = se.focusOffset;
        if (!se.anchorNode || !se.focusNode) {
          return res;
        }
        let startEl = se.anchorNode.parentElement;
        let endEl = se.focusNode.parentElement;
        let startText = startEl.innerText;
        if (startEl == endEl) {
          res = startText.substring(start, end);
        }
        return res;
      }
      return res;
    }

    /**
     * 添加文字样式 
     * */
    addTextStyle (command, args) {
      let editBox = this.refs.editBox;
      // 获取目前editBox所在光标位置
      editBox.focus();
      var selection = getSelection()
      // 判断是否有最后光标对象存在
      if (this.state.lastEditRange) {
          // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
          selection.removeAllRanges()
          selection.addRange(this.state.lastEditRange)
      }

      switch(command){
        case "bold": 
          document.execCommand('bold',false,null);
          break;
        case "italic": 
          document.execCommand('italic',false,null);
          break;
        case "link": 
          if(this.state.linkHref) 
            document.execCommand("createlink",false,this.state.linkHref);
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
          this.insertBlockquote();
          break; 
        case "image": 
          if (args.url) {
            document.execCommand("insertImage", false, args.url);
          }
        break;
        case "code": 
          document.execCommand('formatBlock', false, '<pre>');
        break;
        case "undo": 
          document.execCommand('Undo');
        break;
        default:;
			}
    }

    /**
     * 保存草稿
     */
    async saveDraft () {
      let state = this.state;
      let params = {
          token: this.props.userStore.user.token,
          userId: this.props.userStore.user.userId,
          title: this.state.title,
          content: this.state.content,
          isAuth: this.state.isAuth,
          publish: 0,
          parentId: this.state.parentId
      };
      // 团队
      if (state.space.type === GROUP) {
        params.groupId = state.space.id;
      }

      this.setState({
        lastSaveTime: '正在保存草稿'
      })

      // 如果是更新文档
      if (state.isUpdate) {
        params.postId = state.postId;
        if (!state.draftId) {
          Qlquery.createPost(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                draftId: res.postId,
                lastSaveTime: res.date
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        } else {
          // 修改post状态
          params.draftId = state.draftId;
          Qlquery.updatePost(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                lastSaveTime: res.date
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      } else {
        // 创建文档
        if (!state.draftId) {
          Qlquery.createPost(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                draftId: res.postId,
                lastSaveTime: res.date
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        } else {
          // 修改post状态
          params.draftId = state.draftId;
          Qlquery.updatePost(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              this.setState({
                lastSaveTime: res.date
              });
            } else {
              this.setState({
                lastSaveTime: '保存失败'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      }
    }

    /**
     * 发布文章
     */
    async publishPost () {
      console.log(this.state);
      let state = this.state;
      let params = {
          token: this.props.userStore.user.token,
          userId: this.props.userStore.user.userId,
          title: this.state.title,
          content: this.refs.editBox && (this.refs.editBox.innerHTML).replace('"', '&quot;'),
          isAuth: this.state.isAuth,
          publish: 1,
          parentId: this.state.parentId
      };

      // 团队
      if (state.space.type === GROUP) {
        params.groupId = state.space.id;
      }

      // 如果是发布确认修改的文章
      if (state.isUpdate) {
        params.draftId = state.draftId;
        params.postId = state.postId;
    
        Qlquery.updatePost(params)
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            let url = `/library/${state.space.type === USER ? "user" : "group"}/${state.space.id}/${this.state.postId}`
            this.props.history.push(url)
          }
        })
        .catch((err) => {
          console.log(err);
        })

      } else {
        if (state.draftId) {
          console.log(params);
          // 修改草稿状态
          params.draftId = this.state.draftId;
          Qlquery.updatePost(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              let url = `/library/${state.space.type === USER ? "user" : "group"}/${state.space.id}/${res.postId}`
              this.props.history.push(url)
            }
          })
          .catch((err) => {
            console.log(err);
          })
        } else {
          // 发布文章
          Qlquery.createPost(params)
          .then(({data}) => {
            let res = data.data.data;
            if (res.code === 1) {
              // 跳转页面
              let url = `/library/${state.space.type === USER ? "user" : "group"}/${state.space.id}/${res.postId}`
              this.props.history.push(url)
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      }  
    }

    /**
     * 数据输入变化
     */
    editGetChange () {
      // 如果数据有变化，5秒保存一次草稿
      if (!this.state.changeTimer) {
        this.setState({
          changeTimer: setTimeout(() => {
            if (!this.refs.editBox) {
              clearTimeout(this.state.changeTimer);
              return;
            }
            let content = this.refs.editBox.innerText;
            if (content.length >= 10) {
              this.saveDraft()
            }
          }, 5000)
        })        
      }
    }

    /**
     * 离开聚焦
     */
    editGetBlur () {
      var selection = getSelection();
      this.setState({
        lastEditRange: selection.getRangeAt(0)
      })       
    }

    insertNode(node, needAdd = false) {
      let editBox = this.refs.editBox;
      editBox.focus();
      var selection = getSelection();
      let lastNode = node;
      let anchorNode = selection.anchorNode;
      // 判断选定对象范围是编辑框还是文本节点
      if(anchorNode.nodeName !== '#text') {
          // 如果是编辑框范围。则创建表情文本节点进行插入
            let parentNode = anchorNode === this.refs.editBox ? anchorNode : anchorNode.parentNode;
              if (parentNode.childNodes.length > 1) {
                  // 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入表情节点
                  for (var i = 1; i < parentNode.childNodes.length; i++) {
                    if (parentNode.childNodes[i - 1] === anchorNode) {
                        if (node.nodeName === "BR") {
                          lastNode = parentNode.childNodes[i];
                        }
                        parentNode.insertBefore(node, parentNode.childNodes[i]);
                        if (needAdd) {
                          parentNode.insertBefore(document.createElement('br'), parentNode.childNodes[i]);
                        }
                        break;
                    }
                  }
                  if (i === parentNode.childNodes.length) {
                    parentNode.appendChild(node);
                  }
              } else {
                  parentNode.appendChild(node)
                  if (needAdd) {
                    parentNode.appendChild(document.createElement('br'));
                  }
            }            

          
      } else {
          // 如果是文本节点则先获取光标对象
          var range = selection.getRangeAt(0)
          // 光标位置在末尾，则添加到后面
          var textNode = range.startContainer;
          let value = textNode.nodeValue;
          let offset = range.startOffset;
          let parentNode = textNode.parentNode;
          if (range.startOffset < value.length - 1) {
              let frontText = document.createTextNode(value.substring(0, offset)),
                  backText = document.createTextNode(value.substring(offset, value.length));
              parentNode.insertBefore(frontText,textNode);
              parentNode.insertBefore(node,textNode);
              parentNode.insertBefore(backText,textNode);
              parentNode.removeChild(textNode);
          } else {
              // br的存在使得有多个孩子
              if(parentNode.childNodes.length > 1) {
                for (var i = 1, len = parentNode.childNodes.length; i < len; i++ ){
                  if (parentNode.childNodes[i - 1] === textNode) {
                    if (node.nodeName === "BR") {
                      lastNode = parentNode.childNodes[i];
                    }
                    parentNode.insertBefore(node, parentNode.childNodes[i]);
                    if (needAdd) {
                      parentNode.insertBefore(document.createElement('br'), parentNode.childNodes[i]);
                    }
                    break;
                  }
                }
                if (i === parentNode.childNodes.length) {
                  parentNode.appendChild(node);
                }
              } else {
                parentNode.appendChild(node);
                if (needAdd) {
                  parentNode.appendChild(document.createElement('br'));
                }
              }
          }
      }
      // 创建新的光标对象
      var range = document.createRange()
      range.selectNodeContents(lastNode)
      if (node.nodeName !== "BR" && node.childNodes && node.childNodes.length) {
          let len = node.childNodes.length;
          range.setStart(node.childNodes[len-1], node.childNodes[len-1].length || 0)
      } else {
        range.setStart(lastNode, 0);
      }
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      this.setState({
         lastEditRange:selection.getRangeAt(0)
      })
    }

    toggleMarkdown () {
      this.setState({
        markdown: turndownService.turndown(this.refs.editBox.innerHTML)
      })
      this.refs.markdown.toggle();
    }

    toggleMoreSetting () {
      this.refs.setting.toggle();
    }

    toggleCode () {
      this.refs.addCode.toggle();
    }

    insertBlockquote () {
      // 获取选取文字
      let select = window.getSelection(),
          selectText = select.toString();
      let blockquote = document.createElement('blockquote');
      // 如果没有选取文字，就设为Br
      if (!selectText) {
        blockquote.appendChild(document.createElement('br'));
      } else {
        // console.log(selectText);
        let text = selectText && selectText.split('\n');
        for (let i = 0, len = text.length; i < len; i++) {
          blockquote.appendChild(document.createTextNode(text[i]));
          blockquote.appendChild(document.createElement('br'));
        }
        select.anchorNode.parentNode.removeChild(select.anchorNode);
      }
      this.insertNode(blockquote, true);
    }

    // 插入链接
    toggleLinkModal () {
      let txt = this.getSelection();
      this.setState({
        selectText: txt && txt.trim()
      });
      this.refs.addLink.toggle();
    }
    insertSelectLink () {
      if (this.state.linkHref.search(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/) < 0) {
        this.setState({
          tipText: '网址格式错误'
        })
        this.refs.tooltip.show()
        return;
      }
      this.addTextStyle.bind('link');
      this.refs.addLink.toggle();
    }
    insertDirectLink () {
      let name = this.state.linkName;
      if (this.state.linkHref.search(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/) < 0) {
        this.setState({
          tipText: '网址格式错误'
        })
        this.refs.tooltip.show()
        return;
      } else if (!name) {
        name = this.state.linkHref;
      }
      let link = document.createElement('a');
      link.href = this.state.linkHref;
      link.target = "_blank"
      link.appendChild(document.createTextNode(name));
      this.insertNode(link);
      this.refs.addLink.toggle();
    }
    
    showTooltip (text) {
      if (this.refs.tooltip) {
        this.setState({
          tipText: text
        })
        this.refs.tooltip.show();        
      }
    }

     // 插入图片
     toggleImageModal () {
      this.setState({
        imgSrc: '',
        imgSrcBase: '',
        imgSrcText: '',
        imgSrcTip: ''
      })
      this.refs.addImage.toggle();
    }
    insertUploadImage () {
      if (!this.state.imgSrcBase) {
        this.setState({
          tipText: '上传图片不能为空'
        })
        this.refs.tooltip.show()
        return;
      }

      // 上传图片
      Qlquery.uploadImage({
        token: this.props.userStore.user.token,
        userId: this.props.userStore.user.userId,
        imgbase: this.state.imgSrcBase
      })
      .then(({data}) => {
        let res =data.data.data;
        console.log(res);
        if (res.code === 1) {
          this.setState({
            imgSrc: res.url
          })
          this.addTextStyle('image');
          this.refs.addImage.toggle();
        } else {
          this.setState({
            tipText: '上传图片出错'
          })
          this.refs.tooltip.show()
        }
      })
      .catch((err) => {
        console.log(err);
      })

    }
    insertDirectImage () {
      if (this.state.imgSrc.search(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/) < 0) {
        this.setState({
          tipText: '图片地址格式错误'
        })
        this.refs.tooltip.show()
        return;
      }
      this.addTextStyle.bind(this, 'image');
      this.refs.addLink.toggle();
    }

    insertCode (code) {
      this.refs.editBox.innerHTML = this.refs.editBox.innerHTML + code;
    }
    
    // 获取图片信息
    insertImage (args) {
      this.addTextStyle('image', args);
    }

    componentWillUnmount () {
      clearTimeout(this.state.lockTimer)
      clearTimeout(this.state.changeTimer)
      this.setState({
        changeTimer: null,
        lockTimer: null
      });
    }

    generateLink () {
      if (this.state.selectText && this.state.selectText.length > 0) {
        return (
          <div className="edit-link-body">
            <div className="input-group">
              <label>链接地址</label>
              <input type="text" onChange={
                (e) => {
                  this.setState({
                    linkName: e.target.value
                  })
                }
              }/>
            </div>
            <div className="input-group">
              <button className="radius-btn input-btn" 
                      onClick={this.insertSelectLink.bind(this)}>确定</button>
            </div>
          </div>
        )
      } else {
        return (
          <div className="edit-link-body">
            <div className="input-group">
              <label>链接名称</label>
              <input type="text" placeholder="默认为链接地址" onChange={
                (e) => {
                  this.setState({
                    linkName: e.target.value
                  })
                }
              }/>
            </div>
            <div className="input-group">
              <label>链接地址</label>
              <input type="text" placeholder="http://" onChange={
                (e) => {
                  this.setState({
                    linkHref: e.target.value
                  })
                }
              }/>
            </div>
            <div className="input-group">
              <button className="radius-btn input-btn" 
                      onClick={this.insertDirectLink.bind(this)}>确定</button>
            </div>
          </div>
        )
      }
    }

    editGetFocus () {
      clearTimeout(this.state.changeTimer);
      this.setState({
        changeTimer: null
      })
    }

    editGetEnter (e) {
      let code = e.keyCode
      this.editGetFocus();
      if (code === 13) {
        // 要判断是在什么标签内回车，再进行分别的添加
        let selection = getSelection();
        this.setState({
          lastEditRange: selection.getRangeAt(0)
        })
        let parentNode = selection.anchorNode.parentNode;
        if (parentNode.nodeName === "CODE" || parentNode.nodeName === "BLOCKQUOTE") {
          // 说明要在code标签里添加换行
          this.insertNode(document.createElement('br'));
          e.preventDefault();
        }
        
      }
    }

    /**
     * 移除草稿
     */
    deleteDraft () {
      if (this.state.draftId) {
        Qlquery.deleteDraft({
          token: this.props.userStore.user.token,
          userId: this.props.userStore.user.userId,
          draftId: this.state.draftId
        })
        .then(({data}) => {
          let res = data.data.data;
          if (res) {
            // 删除成功
            this.setState({
              draftId: null,
              lastSaveTime: ''
            })
          }
        })
      }
    }

    generateSaveStatus () {
      if (this.state.draftId) {
        return (
          <span>
            {this.state.lastSaveUser.nickname} 最后保存于 {this.state.lastSaveTime}（<span className="btn-text" onClick={this.deleteDraft.bind(this)}>舍弃</span>）
          </span>
        )
      } else {
        return (
          <span>
          {this.state.lastSaveUser.nickname} 最后保存于 {this.state.lastSaveTime}
          </span>
        )
      }
    }

    render () {
        return (
          <div className="page">
          <Sidebar />
            <div className="flex-row overflow flex-1">
              <Loading ref="loading" />
              <Tooltip text={this.state.tipText} ref="tooltip"/>
              <Modal title="转为Markdown" ref="markdown">
                <div className="markdown-show">
                {this.state.markdown}
                </div>
              </Modal>
              <Modal title="添加链接" ref="addLink">
                {
                  this.generateLink()
                }   
              </Modal>

              <Modal title="高级设置" ref="setting">
                  <div className="edit-menu">
                    <div className="edit-setting-column">
                      <span className="btn-text">父级文档</span>
                          <input type="text" placeholder="搜索ID" className="input"/>
                          <ul className="ul-add-mem">
                            <li>测试测试</li>
                          </ul>
                      <span className="des">影响权限设置</span>
                    </div>

                    <div className="edit-setting flex-row">
                      <div className="flex-column edit-left">
                        <span className="text">是否私密</span>
                        <span className="des">私密文章无关系者无权查看</span>
                      </div>
                      <Switch />                  
                    </div>
                  </div>
              </Modal>
              <CodeModal ref="addCode"
                         getResult={this.insertCode.bind(this)}/>

              <ImageModal ref="addImage"
                          showTip={this.showTooltip.bind(this)}
                          getResult={this.insertImage.bind(this)}
                          sendData={Qlquery.uploadImage.bind(this)}/>
              
              <div className="edit-page flex-1">
                <div className="edit-header">
                  <input type="text"
                        placeholder="输入文章标题" 
                        className="title" 
                        defaultValue={this.state.title}
                        onChange={(e) => {
                          this.setState({
                            title: e.target.value
                          })
                        }}/>
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
                          onClick={this.toggleLinkModal.bind(this)}>
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
                          onClick={this.toggleCode.bind(this)}>
                          <FontAwesomeIcon icon="code"/>
                        </button>
                      </li>
                      <li>
                        <div
                          className="single-tool" 
                          title="图片"
                          onClick={this.toggleImageModal.bind(this)}>
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
                            title="Markdown语法"
                            onClick={this.toggleMarkdown.bind(this)}>
                            <FontAwesomeIcon icon={['fab','markdown']}/>  
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="edit-body"
                    contentEditable ref="editBox"
                    onBlur={this.editGetBlur.bind(this)}
                    onKeyDown={this.editGetEnter.bind(this)}
                    onKeyUp={this.editGetChange.bind(this)}
                    dangerouslySetInnerHTML={{
                      __html: this.state.content
                    }}
                    >
                </div>
                <div className="edit-footer">
                  <p><span className="label">{this.state.space.type === GROUP ? "团队": "个人"}</span>
                    <Link to={this.state.space.type === "user" ? `/library/user/${this.state.space.id}` : `/library/group/${this.state.space.id}`}>
                    {this.state.space.name}
                    </Link>  / <span className="tip-bold">{this.state.title || '未命名'}</span> <FontAwesomeIcon icon={['far', 'caret-square-down']} className="set-btn" onClick={this.toggleMoreSetting.bind(this)}/>{this.generateSaveStatus()}</p>
                  <div className="btns-box">
                    <button className="radius-btn sub-btn" onClick={()=> {
                      clearTimeout(this.state.changeTimer);
                      this.setState({
                        changeTimer: null
                      })
                      this.saveDraft.apply(this);
                    }}>保存草稿</button>
                    <button className="radius-btn input-btn" onClick={this.publishPost.bind(this)}>发布</button>
                  </div>
                </div>
              </div>
              </div>
          </div>
        );
    }
}

export default Page;