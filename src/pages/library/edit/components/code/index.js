import React, {Component} from 'react';
import Modal from '../../../../../components/modal';

class CodeModal extends Component {
    constructor () {
        super();
        this.state = {
            code: ''
        }
    }

    transCode () {
        let code = this.state.code && this.state.code.split('\n');
        let arr = code && code.map(item => {
            return `${item}</br>`
        });
        arr.unshift('<pre><code>')
        arr.push('</code></pre></br>')
        this.props.getResult(arr.join(''));
        this.toggle()
    }

    toggle () {
        this.refs.insert.toggle()
    }

    render () {
        return (
            <Modal title="插入代码" ref="insert">
                <div className="code-modal">
                    <textarea value={this.state.code}
                        placeholder="在此输入代码内容..."
                        onChange={(e) => {this.setState({code: e.target.value})}}>
                    </textarea>
                    <button className="input-btn radius-btn"
                            onClick={this.transCode.bind(this)}>确认</button>
                </div>                
            </Modal>
        )
    }
}

export default CodeModal;