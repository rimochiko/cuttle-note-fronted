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
                      <div className="wrapper-textlist-box">
                      </div>                      
                    </div>
                    <div className="wrapper-right">
                        <Header />
                        <div className="wrapper-photo">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;