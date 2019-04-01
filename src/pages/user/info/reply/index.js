import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';
class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="infos flex-1">
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar3.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">肥嘟嘟左卫门</p>
                        <p className="quote">
                          <Link to="/">RE：如何成为一个优秀的工程师？</Link>
                          “谢谢你啊！”
                        </p>
                         没事，小意思。
                        </div>
                        <p className="date">12:09 <span>回复</span></p>
                    </div>
                </div>
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar3.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">肥嘟嘟左卫门</p>
                        <p className="quote">
                          <Link to="/">RE：如何成为一个优秀的工程师？</Link>
                          “谢谢你啊！”
                        </p>
                         没事，小意思。
                        </div>
                        <p className="date">12:09 <span>回复</span></p>
                    </div>
                </div>
                <div className="item-infos">
                    <div className="cover-infos">
                        <img src={require('../../../../assets/images/avatar3.jpg')}/>
                    </div>
                    <div className="info-infos">
                        <div className="bubble">
                        <p className="name">肥嘟嘟左卫门</p>
                        <p className="quote">
                          <Link to="/">RE：如何成为一个优秀的工程师？</Link>
                          “谢谢你啊！”
                        </p>
                         没事，小意思。
                        </div>
                        <p className="date">12:09 <span>回复</span></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;