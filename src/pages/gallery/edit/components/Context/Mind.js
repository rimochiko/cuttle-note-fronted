import React from 'react';
import { NodeMenu, CanvasMenu, ContextMenu } from 'gg-editor';
import MenuItem from './MenuItem';

const MindContextMenu = () => {
  return (
    <ContextMenu className="chart-context-box">
      <NodeMenu>
        <MenuItem command="append" text="添加节点" icon="plus"/>
        <MenuItem command="appendChild" icon="append-child" text="添加子节点" icon="plus"/>
        <MenuItem command="collapse" text="折叠" icon="compress"/>
        <MenuItem command="expand" text="展开"  icon="expand"/>
        <MenuItem command="delete" text="移除" icon="trash"/>
      </NodeMenu>
      <CanvasMenu>
        <MenuItem command="undo" text="撤销" icon="undo"/>
        <MenuItem command="redo" text="重做" icon="redo"/>
      </CanvasMenu>
    </ContextMenu>
  );
};

export default MindContextMenu;