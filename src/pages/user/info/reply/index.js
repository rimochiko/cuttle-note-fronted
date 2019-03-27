import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="infos flex-1">
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar_admin1.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">肥嘟嘟左卫门</p>
                        <p className="title">欢迎加入墨鱼笔记！</p>
                        亲爱的小新同学，你已经成功注册并成为了墨鱼笔记的一员了，墨鱼笔记有着很多很多新的功能等着你的发现和挖掘，希望墨鱼笔记能给你带来不一样的感觉。
                        </div>
                        <p className="date">12:09</p>
                    </div>
                </div>
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar_admin1.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">肥嘟嘟左卫门</p>
                        <p className="title">欢迎加入墨鱼笔记！</p>
                        亲爱的小新同学，你已经成功注册并成为了墨鱼笔记的一员了，墨鱼笔记有着很多很多新的功能等着你的发现和挖掘，希望墨鱼笔记能给你带来不一样的感觉。
                        </div>
                        <p className="date">12:09</p>
                    </div>
                </div>
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar_admin1.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">肥嘟嘟左卫门</p>
                        <p className="title">欢迎加入墨鱼笔记！</p>
                        亲爱的小新同学，你已经成功注册并成为了墨鱼笔记的一员了，墨鱼笔记有着很多很多新的功能等着你的发现和挖掘，希望墨鱼笔记能给你带来不一样的感觉。
                        </div>
                        <p className="date">12:09</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;