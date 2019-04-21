import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import DropDown from '../../components/dropdown';
import Badge from '../../components/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss';

let dropMenudata = [{
    id: 1,
    text: '新文档',
    link: '/article/edit',
    icon: 'file-alt'
}, {
    id: 2,
    text: '新画图',
    link: '/photo/edit',
    icon: 'file-image'
}]

class Header extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="public-header">
                <div className="left-header">
                </div>
                <div className="right-header flex-row">
                    <div className="search-box icon-right">
                        <input type="text" className="input-search" placeholder="用户/群组/文档"/>
                        <FontAwesomeIcon icon="search" className="header-icon"/>
                    </div>
                    <DropDown data={dropMenudata}>
                        <FontAwesomeIcon icon="plus" className="header-icon icon-right"/>
                    </DropDown>
                    <Link to="/info"><Badge><FontAwesomeIcon icon="bell" className="header-icon icon-right"/></Badge></Link>
                </div>
            </div>
        );
    }
}

export default Header;