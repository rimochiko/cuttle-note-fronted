import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div>
                <Sidebar />
                <div className="wrapper-main">
                    <div className="wrapper-left">
                      <div className="wrapper-options">
                        <FontAwesomeIcon icon="trash-alt" />
                        <FontAwesomeIcon icon="search" /> 
                        <FontAwesomeIcon icon="folder" /> 
                      </div>
                      <div className="wrapper-infolist">
                        <h1 className="title-wrapper">我的消息箱</h1>
                        <div className="item-info noread">
                          <div className="cover-info">
                            <img src={require('../../../assets/images/avatar_admin.jpg')}/>
                          </div>
                          <div className="info-info">
                            <p className="text-main"><span class="text-status">未读</span>举报处理结果通知</p>
                            <p className="text-date">2019年3月10日 15:23</p>
                            <p className="text-sub">您好，您在视频[日漫改]她爱上了我的谎/迷雾中的蝴蝶(2013年)-剧中歌曲向cut中举报的弹幕『未删减版同步连载中+微新:ss66802』已被删除，原因是『恶意刷屏』</p>
                          </div>
                        </div>
                        <div className="item-info read">
                          <div className="cover-info">
                            <img src={require('../../../assets/images/avatar_admin1.jpg')}/>
                          </div>
                          <div className="info-info">
                            <p className="text-main"><span class="text-status">已读</span>欢迎加入墨鱼笔记！</p>
                            <p className="text-date">2019年3月10日 15:23</p>
                            <p className="text-sub">亲爱的小新同学，你已经成功注册并成为了墨鱼笔记的一员了，墨鱼笔记有着很多很多新的功能等着你的发现和挖掘，希望墨鱼笔记能给你带来不一样的感觉。</p>
                          </div>
                        </div>
                      </div>                      
                    </div>
                    <div className="wrapper-right">
                        <Header />
                        <div className="wrapper-infos">
                          <div className="wrapper-infos-top">
                            <div className="item-infos">
                              <div className="cover-infos">
                                  <img src={require('../../../assets/images/avatar_admin1.jpg')}/>
                              </div>
                              <div className="info-infos">
                                <div className="bubble">
                                  <p className="name">肥嘟嘟左卫门</p>
                                  <p className="title">欢迎加入墨鱼笔记！</p>
                                  亲爱的小新同学，你已经成功注册并成为了墨鱼笔记的一员了，墨鱼笔记有着很多很多新的功能等着你的发现和挖掘，希望墨鱼笔记能给你带来不一样的感觉。
                                </div>
                                <p className="date">发布于 12:09</p>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;