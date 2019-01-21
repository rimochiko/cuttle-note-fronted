import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Page extends Component {
    constructor () {
        super()
    }

    render () {
        return (
            <div>test
                <FontAwesomeIcon icon="check-square" />
    Favorite beverage: <FontAwesomeIcon icon="coffee" />
            </div>
        );
    }
}

export default Page;