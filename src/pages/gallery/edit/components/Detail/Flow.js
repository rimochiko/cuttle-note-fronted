import React from 'react';
import { withPropsAPI } from 'gg-editor';

class DetailForm extends React.Component {
  constructor () {
    super()
    this.generateLabel = this.generateLabel.bind(this)
    this.generateLineBtn = this.generateLineBtn.bind(this)
    this.changeLabelText = this.changeLabelText.bind(this)
    this.changeLineType = this.changeLineType.bind(this)
  }

  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  /**
   * 更改文字内容
   */
  changeLabelText (e) {
    let label = e.target.value;

    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    setTimeout(() => {
        const item = getSelected()[0];
        if (!item) {
          return;
        }
        executeCommand(() => {
          update(item, {
            label
          });
        });
      },0);
  }

  /**
   * 更换曲线类型
   */
  changeLineType (type) {
    const SMOOTH = 1,
          POLYLINE = 2,
          ROUND = 3;
    let shape;
    switch (type) {
      case SMOOTH: 
      shape = 'flow-smooth';
      break;
      case POLYLINE: 
      shape = 'flow-polyline';
      break;
      case ROUND: 
      shape = 'flow-polyline-round';
      break;
      default: 
      shape = 'flow-smooth';
    }
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    setTimeout(() => {
        const item = getSelected()[0];
        if (!item) {
          return;
        }
        executeCommand(() => {
          update(item, {
            shape
          });
        });
      },0);
  }


  generateLabel () {
    if (!this.item) {
      return (
        <input type="text" disabled placeholder="元素文字..." onBlur={this.changeLabelText}/>
      )
    } else {
      const { label } = this.item.getModel();
      return (
        <input type="text" placeholder="元素文字..." defaultValue={label} onBlur={this.changeLabelText}/>
      )
    }
  }

  generateLineBtn () {
    if (!this.item) {
      return (
        <div className="command-group">
          <button className="item" onClick={this.changeLineType.bind(this, 1)} disabled>
            <img src={require('../../../../../assets/images/tool/line-1.svg')} width="16" alt="line"/>
          </button>
          <button className="item" onClick={this.changeLineType.bind(this, 2)} disabled>
            <img src={require('../../../../../assets/images/tool/line-2.svg')} width="16" alt="line"/>
          </button>
          <button className="item" onClick={this.changeLineType.bind(this, 3)} disabled>
            <img src={require('../../../../../assets/images/tool/line-3.svg')} width="16" alt="line"/>
          </button>        
        </div>
      )
    } else {
      return (
        <div className="command-group">
          <button className="item" onClick={this.changeLineType.bind(this, 1)}>
            <img src={require('../../../../../assets/images/tool/line-1.svg')} width="16" alt="line"/>
          </button>
          <button className="item" onClick={this.changeLineType.bind(this, 2)}>
            <img src={require('../../../../../assets/images/tool/line-2.svg')} width="16" alt="line"/>
          </button>
          <button className="item" onClick={this.changeLineType.bind(this, 3)}>
            <img src={require('../../../../../assets/images/tool/line-3.svg')} width="16" alt="line"/>
          </button>        
        </div>
      )
    }
  }

  render() {
    return (
      <div className="detail-form">
        {
          this.generateLineBtn()
        }
        <div className="divide"></div>
        {
          this.generateLabel()
        }
      </div>
    );
  }
}

export default withPropsAPI(DetailForm);