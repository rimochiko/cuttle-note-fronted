import React, {Component} from 'react';
import './index.scss';

class Badge extends Component {
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