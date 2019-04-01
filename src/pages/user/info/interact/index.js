import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';
class Page extends Component {
    constructor () {
        super();
    }
    /**
     * 互动消息
     * 1.点赞提醒
     * 2.关注提醒
     * 3.收藏提醒
     *  */
    render () {
        return (
            <div className="infos flex-1">
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar2.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">小丸子</p>
                       给你的文章 <Link to="/">如何成长为一个优秀的工程师？</Link> 一个赞。
                        </div>
                        <p className="date">12:09</p>
                    </div>
                </div>
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar2.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">小丸子</p>
                       收藏了你的文章 <Link to="/">如何成长为一个优秀的工程师？</Link> 。
                        </div>
                        <p className="date">12:09</p>
                    </div>
                </div>
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar2.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">小丸子</p>
                       已加入团队 <Link to="/">老鼠爱大米</Link> 。
                        </div>
                        <p className="date">12:09</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;