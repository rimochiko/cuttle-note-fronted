import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject, observer } from 'mobx-react';

class Section extends Component {
    constructor () {
        super();
        this.state = {
            post: {
                id: '',
                author: '',
                content: '',
                createDate: '',
                viewNum: 0,
                likeNum: 0,
                isLike: false,
                isCollect: false
            },
            comments: []
        }
    }

    render () {
        return (
            <div className="article">

            </div>
        );
    }
}

export default Section;