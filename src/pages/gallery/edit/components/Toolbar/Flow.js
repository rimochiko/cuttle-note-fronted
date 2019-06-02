import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';

const MindToolbar = () => {
  return (
    <Toolbar className="ul-chart-tools">
      <ToolbarButton command="undo" icon="undo-alt" text="撤销"/>
      <ToolbarButton command="redo" icon="redo-alt" text="重做"/>
      <ToolbarButton command="copy" text="复制"/>
      <ToolbarButton command="paste" text="粘贴"/>
      <ToolbarButton command="delete" text="删除"/>
      <ToolbarButton command="zoomIn" icon="search-minus" text="放大" />
      <ToolbarButton command="zoomOut" icon="search-plus" text="缩小" />
      <ToolbarButton command="resetZoom" icon="window-restore" text="实际尺寸" />
      <div className="divide"></div>
      <div className="command-group">
        <div className="item">
          <img src={require('../../../../../assets/images/tool/line-1.svg')} width="16" alt="line"/>
        </div>
        <div className="item">
          <img src={require('../../../../../assets/images/tool/line-2.svg')} width="16" alt="line"/>
        </div>
        <div className="item">
          <img src={require('../../../../../assets/images/tool/line-3.svg')} width="16" alt="line"/>
        </div>        
      </div>
      <div className="divide"></div>
      <div className="command-group">
        <input type="text" disabled placeholder="元素文字..."/>
      </div>
    </Toolbar>
  );
};

export default MindToolbar;