import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';
import Qlquery from './graphql';

@inject('userStore')
@observer
class Section extends Component {
    constructor () {
        super();
        this.state = {
            post: {
                id: '',
                author: '',
                content: '',
                createDate: '',
                viewNum: 0,
                likeNum: 0,
                isLike: false,
                isCollect: false,
                comments: []
            },
            comment: '',
            reply: {
                id: '',
                name: ''
            },
            isAuth: false
        }
        this.generateBtn = this.generateBtn.bind(this);
        this.generateCollectBtn = this.generateCollectBtn.bind(this);
        this.generateComment = this.generateComment.bind(this);
        this.generateExtra = this.generateExtra.bind(this);
    }

    componentWillUpdate (nextProps) {
        if (this.props.post && (nextProps.post !== this.props.post)) {
            this.setState({
                post: nextProps.post,
                isAuth: nextProps.isAuth
            })
        }
    }

    /**
     * 喜欢文章
     */
    like () {
        Qlquery.like({
            id: this.state.post.id,
            token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId           
        })
        .then(({data}) => {
            let res = data.data.data;
            if (res.code === 0) {
                // 喜欢成功
                let post = Object.assign({},this.state.post, {
                    isLike: true,
                    likeNum: parseInt(this.state.post.likeNum) + 1
                })
                this.setState({
                    post: post
                });
            } else {
                this.props.showTooltip("电波发送失败:(")
            }
        })
        .catch((err) => {
            console.log(err);
            this.props.showTooltip("电波发送失败:(")
        })
    }

    /**
     * 取消喜欢
     */
    cancelLike (){
        Qlquery.unLike({
            id: this.state.post.id,
            token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId 
        })
        .then(({data}) => {
            let res = data.data.data;
            if (res.code === 0) {
                // 取消喜欢成功
                let post = Object.assign({},this.state.post, {
                    isLike: false,
                    likeNum: parseInt(this.state.post.likeNum) - 1
                })
                this.setState({
                    post: post
                });
            } else {
                this.props.showTooltip("电波发送失败:(");
            }
        })
        .catch((err) => {
            console.log(err);
            this.props.showTooltip("电波发送失败:(")
        })
    }
    
    /**
     * 收藏文章
     *  */
    collect () {
        Qlquery.collect({
            postId: this.state.post.id,
            token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId
        })
        .then(({data}) => {
            let res = data.data.data;
            if (res.code === 0) {
                // 收藏成功
                let post = Object.assign({},this.state.post, {
                    isCollect: true
                })
                this.setState({
                    post: post
                });
            } else {
                this.props.showTooltip("电波发送失败:(")
            }
        })
        .catch((err) => {
            console.log(err);
            this.props.showTooltip("电波发送失败:(");
        })
    }

    /**
     * 取消收藏文章
     *  */
    cancelCollect () {
        Qlquery.unCollect({
            postId: this.state.post.id,
            token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId
        })
        .then(({data}) => {
            let res = data.data.data;
            if (res.code === 0) {
                // 取消收藏成功
                let post = Object.assign({},this.state.post, {
                    isCollect: false
                })
                this.setState({
                    post: post
                });
            } else {
                this.props.showTooltip("电波发送失败:(")
            }
        })
        .catch((err) => {
            console.log(err);
            this.props.showTooltip("电波发送失败:(")
        })
    }    

    /**
     * 添加评论回复
     */
    addReply (replyId, replyName) {
        if (replyId) {
            this.setState({
                reply: {
                    name: replyName,
                    id: replyId
                }
            })
        }
    }
    
    /**
     * 评论文章
     */
    comment () {
        Qlquery.comment({
            postId: this.state.post.id,
            token: this.props.userStore.user.token,
            userId: this.props.userStore.user.userId,
            replyId: this.state.reply.id || '',
            comment: this.state.comment,
        })
        .then(({data}) => {
            let res = data.data.data;
            if (res.code === 0) {
                // 评论成功
                let comments = res.result;
                console.log(comments);
                this.setState({
                    reply: {
                        id: '',
                        name: ''
                    },
                    comment: '',
                    post: Object.assign({}, this.state.post, {
                        comments
                    })
                });
                this.props.showTooltip("添加评论成功:)")
            } else {
                this.props.showTooltip("电波发送失败:(");
            }
        })
        .catch((err) => {
            console.log(err);
            this.props.showTooltip("电波发送失败:(")
        })
    }

    generateBtn () {
        // 大于1，说明是团队成员身份
        if (this.state.isAuth > 1) {
            if (this.state.isAuth === 4 || this.state.isAuth === 6) {
                return (
                    <p>
                        <Link title="编辑" to={{pathname:'/article/edit', 
                                                query: {postId: this.state.post.id,
                                                       parentId: this.state.post.parent}}}>
                            <FontAwesomeIcon icon="pen"/>
                        </Link>
                        <span title="删除" onClick={this.props.removePost}>
                            <FontAwesomeIcon icon="trash-alt"/>
                        </span>
                    </p>
                )
            }
            return (
                <Link title="编辑" to={{pathname:'/article/edit', 
                                        query: {postId: this.state.post.id,
                                                parentId: this.state.post.parent}}}>
                    <FontAwesomeIcon icon="pen"/>
                </Link>
            )
        }

        if (this.state.isAuth) {
            return (
                <p>
                    <Link title="编辑" to={{pathname:'/article/edit', 
                                            query: {postId: this.state.post.id,
                                                   parentId: this.state.post.parent}}}>
                        <FontAwesomeIcon icon="pen"/>
                    </Link>
                    <span title="删除" onClick={this.props.removePost}>
                        <FontAwesomeIcon icon="trash-alt"/>
                    </span>
                </p>
            )
        }
    }


    generateCollectBtn () {
        if (this.state.post.isCollect) {
            return (
                <li onClick={this.cancelCollect.bind(this)}><FontAwesomeIcon icon="star" className="collect"></FontAwesomeIcon> 取消收藏</li>
            )
        } else {
            return (
                <li onClick={this.collect.bind(this)}><FontAwesomeIcon icon={["far", "star"]}></FontAwesomeIcon> 收藏</li>
            )
        }
    }


    generateLikeBtn () {
        if (this.state.post.isLike) {
            return (
                <li onClick={this.cancelLike.bind(this)}><FontAwesomeIcon icon="thumbs-up" className="thumbs"></FontAwesomeIcon> {this.state.post.likeNum}</li>
            )
        } else {
            return (
                <li onClick={this.like.bind(this)}><FontAwesomeIcon icon={["far","thumbs-up"]}></FontAwesomeIcon> {this.state.post.likeNum}</li>
            )
        }
    }


    generateExtra () {
        if (this.state.post.status === 0) {
            return (
                <div className="extra"></div>
            )
        } else {
            return (
                <div className="extra">
                    <ul className="extra-ul">
                        <li><FontAwesomeIcon icon={["far","eye"]}></FontAwesomeIcon> {this.state.post.viewNum}</li>
                        {
                            this.generateLikeBtn()
                        }
                    </ul>
                    <ul className="extra-ul">
                        {
                            this.generateCollectBtn()
                        }
                    </ul>
                </div>
            )
        }
    }
    cancelReply () {
        this.setState({
            reply: {
                id: '',
                name: ''
            }
        })
    }

    generateReply () {
        if (this.state.reply.id) {
            return (
              <p className="reply-text">
                 回复：{this.state.reply.name}
                 <FontAwesomeIcon icon="window-close" onClick={this.cancelReply.bind(this)}></FontAwesomeIcon>
              </p>
            )
        }
    }

    generateComment () {
        if (this.state.post.status === 0) {
            return;
        }
        return (
            <div className="comments">
                <h1 className="section-title">我要评论</h1>
                <div className="input-comment-box">
                     {this.generateReply()}
                    <textarea className="input-textarea" 
                              onChange={(e)=>{
                                let value = e.target.value;
                                this.setState({
                                    comment: value
                                })
                              }}
                              value={this.state.comment}>
                    </textarea>
                    <div className="input-btn-box">
                      <button className="input-btn radius-btn" onClick={this.comment.bind(this)}>提交</button>
                    </div>
                </div>

                <div className="list-comment-box">
                    <h1 className="section-title">全部评论（{this.state.post.comments.length}）</h1>
                    <ul className="ul-comment-single">
                    {
                        this.state.post&&this.state.post.comments.map((item) => {
                        if (item.receiverId) {
                            return (
                            <li className="li-comment-single" key={item.id}>
                                <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` : require('../../../assets/images/default.jpg')}
                                     alt=""/>
                                <div className="author-comment">
                                <Link to="/">{item.creatorName}</Link> 回复 <Link to="/">{item.receiverName}</Link>：
                                {item.content}
                                <span className="date"> {item.date}</span>
                                </div>
                                <span className="btn-reply" onClick={this.addReply.bind(this, item.id, item.creatorName)}>回复</span>
                            </li>                                      
                            )
                        } else {
                            return (
                            <li className="li-comment-single" key={item.id}>
                                <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` : require('../../../assets/images/default.jpg')}
                                     alt=""/>
                                <div className="author-comment">
                                <Link to="/">{item.creatorName}</Link>：
                                {item.content}
                                <span className="date"> {item.date}</span>
                                </div>
                                <span className="btn-reply" onClick={this.addReply.bind(this, item.id, item.creatorName)}>回复</span>
                            </li>        
                            )
                        }
                        })
                    }
                    </ul>
                </div>
            </div>
        )
    }

    render () {
        return (
            <div className="article">
                <div className="header">
                <h1 className="title">{this.state.post.title}</h1>
                <div className="detail">
                    <p>
                        <span>创建人：<Link to={`/library/${this.state.post.author.id}`}>{this.state.post.author.nickname}</Link></span>
                        <span>创建日期：{this.state.post.createTime}</span>
                    </p>
                    {
                        this.generateBtn()
                    }
                </div>
                </div>
                <div className="body">
                    <div className="content" dangerouslySetInnerHTML={{__html: unescape(this.state.post.content)}}>
                    </div>
                    {
                        this.generateExtra()
                    }
                </div>
                {
                    this.generateComment()
                }
            </div>
        );
    }
}

export default Section;