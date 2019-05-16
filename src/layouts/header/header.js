import React, {Component} from 'react';
import { Link,withRouter } from 'react-router-dom'
import DropDown from '../../components/dropdown';
import Badge from '../../components/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './header.scss';
import { inject, observer } from 'mobx-react';


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

@inject('userStore')
@observer
class Header extends Component {
    constructor () {
        super();
        this.generateInfo = this.generateInfo.bind(this)
    }

    generateInfo () {
        let infoNum = this.props.userStore.infoNum;
        if (infoNum > 0) {
            return (
                <Badge><FontAwesomeIcon icon="bell" className="header-icon icon-right"/></Badge>
            )
        } else {
            return (
                <FontAwesomeIcon icon="bell" className="header-icon icon-right"/>
            )
        }
    }

    render () {
        console.log(this.props);
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
                                     this.props.history.push('/search/article')
                                 }
                               }}/>
                        <FontAwesomeIcon icon="search" className="header-icon"/>
                    </div>
                    <DropDown data={dropMenudata}>
                        <FontAwesomeIcon icon="plus" className="header-icon icon-right"/>
                    </DropDown>
                    <Link to="/info">
                    {
                        this.generateInfo()
                    }
                    </Link>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);