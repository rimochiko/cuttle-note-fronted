import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class DropDown extends Component {
    constructor () {
        super();
    }

    render () {
        const { children } = this.props;
        return (
            <div className="mck-dropdown">
                {children}
                <ul className="mck-dropdown-box">
                {
                    this.props.data.map((item, index) => {
                        if (item.icon) {
                            return (
                                <li className="mck-dropdown-item" key={item.id}><Link to={item.link}><FontAwesomeIcon icon={item.icon} />{item.text}</Link></li>
                            )
                        } else {
                            return (
                                <li className="mck-dropdown-item" key={item.id}><Link to={item.link}>{item.text}</Link></li>
                            )
                        }
                        
                    })
                }
                </ul>
            </div>
        );
    }
}

export default DropDown;