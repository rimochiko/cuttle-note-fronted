import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import './index.scss';

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
                        return (
                            <li className="mck-dropdown-item" key={item.id}><Link to={item.link}>{item.text}</Link></li>
                        )
                    })
                }
                </ul>
            </div>
        );
    }
}

export default DropDown;