import React, {Component} from 'react';
import Modal from '../../../../../components/modal';

class MarkdownModal extends Component {
    constructor () {
        super();
        this.state = {
            code: ''
        }
    }

    toggle () {
        this.refs.insert.toggle()
    }

    textStyleCommand (e, command) {
        var obj = {
          bold: function (text) {
            return `**${text}**`
          },
          italic: function (text) {
            return `*${text}*`
          },
          listul: function (text) {
            text.replace(/\n/, '');
            return `- ${text}*`
          },
          listol: function (text) {
            text.split('\n').map((item, index) => {
              return `${index+1}.${item}`;
            })
            return text.join('\n');
          },
          heading: function (text, level) {
            // 待改进
            let front = '';
            for (let i=0; i < level; i++) {
              front+='#';
            }
            return `${front} ${text}`;
          },
          link: function (text, link) {
            this.refs.addLink.show();
          },
          quote: function (text) {
  
          },
          code: function (text) {
  
          },
          image: function (text) {
  
          },
          markdown: function () {
          }
  
        }
  
      }

    render () {
        return (
            <Modal title="转为Markdown" ref="insert">
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

export default MarkdownModal;