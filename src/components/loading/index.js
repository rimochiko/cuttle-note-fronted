import React, {Component} from 'react';
import './index.scss';
import cs from 'classnames';

class Loading extends Component {
    constructor () {
        super();
        this.state = {
            isShow: true
        }
    }
    toggle () {
        this.setState({
            isShow: !this.state.isShow
        });
    }
    render () {
        return (
            <div className={cs({
                    'mck-loading': true,
                    'active': this.state.isShow
              })}>
                <img src={require('../../assets/images/loading.svg')} alt="loading"/>
            </div>
        );
    }
}

export default Loading;