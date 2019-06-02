import React from 'react';
import { NodeMenu, EdgeMenu, GroupMenu, MultiMenu, CanvasMenu, ContextMenu } from 'gg-editor';
import MenuItem from './MenuItem';

const FlowContextMenu = () => {
  return (
    <ContextMenu className="chart-context-box">
      <NodeMenu>
        <MenuItem command="copy" icon="copy" text="复制"/>
        <MenuItem command="delete" icon="trash" text="删除"/>
      </NodeMenu>
      <EdgeMenu>
        <MenuItem command="delete" icon="trash" text="删除"/>
      </EdgeMenu>
      <GroupMenu>
        <MenuItem command="copy" icon="copy" text="复制"/>
        <MenuItem command="delete" icon="trash" text="删除"/>
        <MenuItem command="unGroup" icon="object-group" text="拆分组合" />
      </GroupMenu>
      <MultiMenu>
        <MenuItem command="copy" icon="copy" text="复制"/>
        <MenuItem command="paste" icon="paste" text="粘贴"/>
        <MenuItem command="addGroup" icon="object-ungroup" text="合并组合" />
        <MenuItem command="delete" icon="trash"/>
      </MultiMenu>
      <CanvasMenu>
        <MenuItem command="undo" icon="undo" text="撤销"/>
        <MenuItem command="redo" icon="redo"  text="重做"/>
        <MenuItem command="pasteHere" icon="paste" text="粘贴" />
      </CanvasMenu>
    </ContextMenu>
  );
};

export default FlowContextMenu;