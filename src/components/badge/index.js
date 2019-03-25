import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Badge extends Component {
    constructor () {
        super();
    }

    render () {
        const { children } = this.props;
        return (
            <div className="mck-badge">
                {children}
                <span className="mck-badge-dot"></span>
            </div>
        );
    }
}

export default Badge;