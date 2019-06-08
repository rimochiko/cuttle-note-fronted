import React, {Component} from 'react';
import Header from '../../../layouts/header/header';
import Sidebar from '../../../layouts/sidebar/sidebar';
import './index.scss';
import Loading from '../../../components/loading';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

class Page extends Component {
    render () {
        return (
            <div className="page">
                <div className="main flex-column overflow">
                    <div className="not-found">
                      <div className="not-found-center">
                        <p className="title">抱歉！页面无法访问……</p>
                        <p className="des">页面链接可能已失效或被删除</p>
                        <Link to="/">返回首页</Link>                        
                      </div>
                   </div>
                </div>
            </div>
        );
    }
}

export default Page;