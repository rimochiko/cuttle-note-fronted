import React from 'react';
import { NodePanel, EdgePanel, GroupPanel, MultiPanel, CanvasPanel, DetailPanel } from 'gg-editor';
import DetailForm from './DetailForm';

const FlowDetailPanel = () => {
  return (
    <DetailPanel>
      <NodePanel>
        <DetailForm type="node" />
      </NodePanel>
      <EdgePanel>
        <DetailForm type="edge" />
      </EdgePanel>
      <GroupPanel>
        <DetailForm type="group" />
      </GroupPanel>
      <MultiPanel>
      </MultiPanel>
      <CanvasPanel>
      </CanvasPanel>
    </DetailPanel>
  );
};

export default FlowDetailPanel;