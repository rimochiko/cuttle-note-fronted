import React from 'react';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import FlowDetail from '../Detail';
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
      <FlowDetail />
    </Toolbar>
  );
};

export default MindToolbar;