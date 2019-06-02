import React, {Component} from 'react';
import './index.scss';

class TabPanel extends Component {
    render () {
        const { children } = this.props;
        return (
            <div className="mck-tab-panel">
              {children}
            </div>
        );
    }
}

export default TabPanel;