import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

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
                isCollect: false
            },
            comments: []
        }
    }

    generateBtn () {
        if (this.props.isAuth) {
            return (
                <p>
                    <span title="文章信息" onClick={this.props.infoPost}>
                    <FontAwesomeIcon icon="info-circle"/>
                    </span>
                    <Link title="编辑" to="/article/edit">
                    <FontAwesomeIcon icon="pen"/>
                    </Link>
                    <span title="删除" onClick={this.props.removePost}>
                    <FontAwesomeIcon icon="trash-alt"/>
                    </span>
                </p>
            )
        } else {
            return (
                <p>
                    <span title="文章信息" onClick={this.props.infoPost}>
                    <FontAwesomeIcon icon="info-circle"/>
                    </span>
                </p>
            )
        }
    }

    render () {
        return (
            <div className="article">
                <div className="header">
                <h1 className="title">{this.state.post.title}</h1>
                <div className="detail">
                    <p>
                        <span>创建人：<Link to="/">{this.state.post.author}</Link></span>
                        <span>创建日期：{this.state.post.createDate}</span>
                    </p>
                    {
                        this.generateBtn()
                    }
                </div>
                </div>
                <div className="body">
                <div className="content">
                    {this.post.content}
                </div>
                <div className="extra">
                    <ul className="extra-ul">
                    <li><FontAwesomeIcon icon={["far","eye"]}></FontAwesomeIcon>{this.state.post.viewNum}</li>
                    <li><FontAwesomeIcon icon={["far","thumbs-up"]}></FontAwesomeIcon> {this.state.post.likeNum}</li>
                    </ul>
                    <ul className="extra-ul">
                    <li><FontAwesomeIcon icon={["far", "star"]}></FontAwesomeIcon> 收藏</li>
                    <li><FontAwesomeIcon icon="share-alt"></FontAwesomeIcon> 分享</li>
                    </ul>
                </div>
                </div>
                

                <div className="comments">
                <h1 className="section-title">我要评论</h1>
                <div className="input-comment-box">
                    <textarea className="input-textarea"></textarea>
                    <div className="input-btn-box">
                    <input type="submit" text="提交" className="input-btn radius-btn"/>
                    </div>
                </div>

                <div className="list-comment-box">
                    <h1 className="section-title">全部评论（{this.state.comments.length}）</h1>
                    <ul className="ul-comment-single">
                    {
                        this.state.comments.map((item) => {
                        if (item.to) {
                            return (
                            <li className="li-comment-single" key={item.id}>
                                <img src={item.from.avatar} />
                                <div className="author-comment">
                                <Link to="/">{item.from.nickname}</Link> 回复 <Link to="/">{item.to.nickname}</Link>：
                                {item.content}
                                <span className="date"> {item.date}</span>
                                </div>
                                <span className="btn-reply">回复</span>
                            </li>                                      
                            )
                        } else {
                            return (
                            <li className="li-comment-single" key={item.id}>
                                <img src={item.from.avatar} />
                                <div className="author-comment">
                                <Link to="/">{item.from.nickname}</Link>：
                                {item.content}
                                <span className="date"> {item.date}</span>
                                </div>
                                <span className="btn-reply">回复</span>
                            </li>        
                            )
                        }
                        })
                    }
                    </ul>
                </div>
                </div>
            </div>
        );
    }
}

export default Section;