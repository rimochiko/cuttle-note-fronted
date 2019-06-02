import React, { Fragment } from 'react';
import { withPropsAPI } from 'gg-editor';

class DetailForm extends React.Component {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    let values = {};
    setTimeout(() => {
      return;
        const item = getSelected()[0];

        if (!item) {
          return;
        }

        executeCommand(() => {
          update(item, {
            ...values,
          });
        });
      });
  };

  renderEdgeShapeSelect = () => {
    return (
      <select onChange={this.handleSubmit}>
        <option value="flow-smooth">Smooth</option>
        <option value="flow-polyline">Polyline</option>
        <option value="flow-polyline-round">Polyline Round</option>
      </select>
    );
  };

  renderNodeDetail = () => {
    const { label } = this.item.getModel();

    return (
      <div label="Label">
        <input onBlur={this.handleSubmit} 
               defaultValue={label}
               type="text"/>
      </div>
    );
  };

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

    return (
      <Fragment>
        <div label="Label">
          <input onBlur={this.handleSubmit} 
                 defaultValue={label}
                 type="text"/>
        </div>
        <div label="Shape">
          {
            this.renderEdgeShapeSelect()
          }
        </div>
      </Fragment>
    );
  };

  renderGroupDetail = () => {
    const { label = '新建分组' } = this.item.getModel();

    return (
      <div>
        <input onBlur={this.handleSubmit} 
               defaultValue={label}/>
      </div>
    );
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        {type === 'node' && this.renderNodeDetail()}
        {type === 'edge' && this.renderEdgeDetail()}
        {type === 'group' && this.renderGroupDetail()}
      </form>
    );
  }
}

export default withPropsAPI(DetailForm);