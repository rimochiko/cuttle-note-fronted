import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';

const MindToolbar = () => {
  return (
    <Toolbar className="ul-chart-tools">
      <ToolbarButton command="zoomIn" icon="search-plus" text="放大" />
      <ToolbarButton command="zoomOut" icon="search-minus" text="缩小" />
      <ToolbarButton command="resetZoom" icon="window-restore" text="实际尺寸" />   
      <div className="divide"></div>
      <ToolbarButton command="append" text="添加同辈" />
      <ToolbarButton command="appendChild" text="添加子辈" />   
      <div className="divide"></div>
      <ToolbarButton command="undo" icon="undo-alt" text="撤销"/>
      <ToolbarButton command="redo" icon="redo-alt" text="重做"/>
      <div className="divide"></div>
      <ToolbarButton command="collapse" icon="compress" text="折叠" />
      <ToolbarButton command="expand" icon="expand" text="展开" />
    </Toolbar>
  );
};

export default MindToolbar;