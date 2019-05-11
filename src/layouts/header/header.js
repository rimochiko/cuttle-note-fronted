import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import DropDown from '../../components/dropdown';
import Badge from '../../components/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss';

let dropMenudata = [{
    id: 1,
    text: '创建新文字',
    link: '/article/edit',
    icon: 'pen'
}, {
    id: 2,
    text: '创建思维图',
    link: '/photo/edit/mind',
    icon: 'brain'
}, {
    id: 3,
    text: '创建流程图',
    link: '/photo/edit/flow',
    icon: 'project-diagram'
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
                        <input type="text"
                               className="input-search" 
                               placeholder="用户/群组/文档"
                               onKeyDown={(e) => {
                                 if(e.keyCode === 13) {
                                     this.history.push('/search/article')
                                 }
                               }}/>
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