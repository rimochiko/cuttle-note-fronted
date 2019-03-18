import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom';
import config from './config';
import './sidebar.scss';

class Sidebar extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div className="public-sidebar">
              <div class="logo">
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
              <div></div>
            </div>
        );
    }
}

export default Sidebar;