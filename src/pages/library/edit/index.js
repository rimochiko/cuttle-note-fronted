import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import Tabs from '../../../components/tabs';
import Switch from '../../../components/switch';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Qlquery from './graphql';
import axios from 'axios';

const TabPane = Tabs.TabPane;

const USER = "user",
      GROUP = "group";

@inject('userStore')
@observer
class Page extends Component {
    constructor () {
        super();
        this.state = {
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
          space: {
            id: '',
            name: '',
            type: ''
          },
          draftTime: null,
          blurTime: null,
          blur: 0,
          markdown: ''
        }
    }

    async componentWillReceiveProps () {

    }

    async componentWillMount () {
      // 判断是否有登录
      if (await this.props.userStore.isLogin() === false) {
        this.props.history.push('/login');
      }
      console.log(this.props);

      if (this.props.location.query && this.props.location.query.postId) {
        document.title = "编辑文章 - 墨鱼笔记";
        this.setState({
          postId: this.props.location.query.postId,
          parentId: this.props.location.query.parentId
        })

        // 如果有postId，说明是编辑文档，要先获取文档内容
        const query = Qlquery.getOnePost({
          userId: this.props.userStore.user.userId,
          postId: this.state.postId,
          token: this.props.userStore.user.token 
        });
        await axios.post('/graphql', {query})
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
              postId: res.post.id,
              parentId: res.post.parent,
              space: space
            })
          } else {
            console.log("请求文章失败")
          }
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        document.title = "创建新文章 - 墨鱼笔记";
        console.log(this.props);
        let space =  {
          id: this.props.userStore.user.userId,
          name: this.props.userStore.user.nickname,
          type: "user"            
        }
        console.log(space);
        this.setState({
          space: space,
          parentId: this.props.location.query && this.props.location.query.parentId || null
        });
      }
    }

    componentDidMount () {
      this.refs.editBox.innerHTML = this.state.post && this.state.post.content || '';
    }

    /**
     * 添加文字样式 
     * */
    addTextStyle (command, args) {
      let editBox = this.refs.editBox;
      // 获取目前editBox所在光标位置
      editBox.focus();

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


    componentWillUnmount () {
      this.setState({
        draftTime: null,
        blurTime: null,
        blur: 0,
      })
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

    /**
     * 保存草稿
     */
    async saveDraft () {
      if (!this.state.postId) {
        const query = Qlquery.createPost({
          token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId,
            title: this.state.title,
            content: this.state.content,
            isAuth: this.state.isAuth,
            publish: 0,
            parentId: this.state.parentId
        });

        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            this.setState({
              postId: res.postId,
              lastSaveTime: res.date
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        // 修改post状态
        const query = Qlquery.updatePost({
            postId: this.state.postId,
            token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId,
            title: this.state.title,
            content: this.state.content,
            isAuth: this.state.isAuth,
            publish: 0,
            parentId: this.state.parentId
        });

        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            this.setState({
              lastSaveTime: res.date
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }
    }

    /**
     * 发布文章
     */
    async publishPost () {
      if (!this.state.postId) {
        const query = Qlquery.createPost({
          token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId,
            title: this.state.title,
            content: this.refs.editBox && (this.refs.editBox.innerHTML).replace('"', '&quot;'),
            isAuth: this.state.isAuth,
            publish: 1,
            parentId: this.state.parentId
        });

        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            // 跳转页面
            this.props.history.push(`/library/user/${this.props.userStore.user.userId}/${res.postId}`)
          }
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        // 修改post状态
        const query = Qlquery.updatePost({
            postId: this.state.postId,
            token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId,
            title: this.state.title,
            content: this.refs.editBox && (this.refs.editBox.innerHTML).replace('"', '&quot;'),
            isAuth: this.state.isAuth,
            publish: 1
        });

        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            this.props.history.push(`/library/user/${this.props.userStore.user.userId}/${res.postId}`)
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }      
    }

    /**
     * 开始聚焦编辑
     */
    editGetFocus () {
      // 开启定时器，1分钟保存一次
      if (!this.state.draftTime) {
        this.setState({
          draftTime: setTimeout(() => {
            this.setState({
              content: this.refs.editBox && this.refs.editBox.innerHTML.replace('"', '&quot;'),
            });
            this.saveDraft();
          }, 60000)
        })
      }

      // 加锁编辑
    }

    /**
     * 离开聚焦
     */
    editGetBlur () {
        this.setState({
          blurTime: setTimeout(() => {
            this.setState ({
              content: this.refs.editBox && this.refs.editBox.innerHTML.replace('"', '&quot;'),
              blur: this.state.blur + 1
            })
            if (this.state.blur > 60) {
              this.setState({
                draftTime: null
              })
            }
          }, 1000)
        })        
    }

    changTitle (e) {
      this.setState({
        title: e.target.value
      })
    }

    toggleMarkdown () {
      this.refs.markdown.toggle();
    }

    toggleMoreSetting () {
      this.refs.setting.toggle();
    }

    render () {
        return (
          <div className="page">
          <Sidebar />
            <div className="flex-row overflow flex-1">
            <Modal title="转为Markdown" ref="markdown">
              <div className="markdown-show">
               {this.state.markdown}
              </div>
            </Modal>
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
                <input type="text"
                       placeholder="输入文章标题" 
                       className="title" 
                       defaultValue={this.state.title}
                       onChange={this.changTitle.bind(this)}/>
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
                   onFocus={this.editGetFocus.bind(this)}
                   dangerouslySetInnerHTML={{
                     __html: this.state.content
                   }}
                   >
                
              </div>
              <div className="edit-footer">
                <p>
                  <Link to={this.state.space.type === "user" ? `/library/user/${this.state.space.id}` : `/library/group/${this.state.space.id}`}>
                  {this.state.space.name}
                  </Link>  / <span className="tip-bold">{this.state.title || '未命名'}</span> <FontAwesomeIcon icon={['far', 'caret-square-down']} className="set-btn" onClick={this.toggleMoreSetting.bind(this)}/>{this.state.lastSaveUser.nickname} 最后保存于 {this.state.lastSaveTime}</p>
                <div className="btns-box">
                  <button className="radius-btn sub-btn" onClick={this.saveDraft.bind(this)}>保存到草稿箱</button>
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