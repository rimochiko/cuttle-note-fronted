import React, {Component} from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Header from '../../../layouts/header/header.js';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
            <div>
                <Header />
            </div>
        );
    }
}

export default Page;