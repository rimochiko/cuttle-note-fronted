import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom';
import config from './config';
import './sidebar.scss';
import DropDown from '../../components/dropdown';
let dropMenudata = [{
    id: 1,
    text: '我的主页',
    link: '/',
    icon: 'user'
}, {
    id: 2,
    text: '账号设置',
    link: '/setting',
    icon: 'cog'
}, {
    id: 3,
    text: '退出',
    link: '/login',
    icon: 'sign-out-alt'
}]

class Sidebar extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="public-sidebar">
              <div className="header">
                <div className="logo">
                    <img src={require('../../assets/images/avatar.jpg')} className="header-avatar"/>
                </div>
                <ul className="ul-nav">
                {
                    config.map((item, index) => {
                            return <li key={item.name}  className="li-nav">
                                <Link to={item.url} className="link-nav" title={item.text}>
                                    <FontAwesomeIcon icon={item.icon} className="link-icon"/>
                                </Link>
                            </li>
                    })
                }
                </ul>
              </div>
              <div>
                <ul className="ul-nav">
                    <li className="li-nav">
                        <Link to='/' className="link-nav">
                            <FontAwesomeIcon icon="fold" className="link-icon"/>
                        </Link>
                    </li>
                    <li className="li-nav">
                        <Link to='/' className="link-nav">
                            <FontAwesomeIcon icon="cog" className="link-icon"/>
                        </Link>
                    </li>
                </ul>
              </div>
            </div>
        );
    }
}

export default Sidebar;