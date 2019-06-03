import React from 'react';
import { NodePanel, EdgePanel, GroupPanel, MultiPanel, CanvasPanel, DetailPanel } from 'gg-editor';
import DetailForm from './Flow';

const FlowDetailPanel = () => {
  return (
    <DetailPanel>
      <NodePanel>
        <DetailForm />
      </NodePanel>
      <EdgePanel>
        <DetailForm />
      </EdgePanel>
      <GroupPanel>
        <DetailForm />
      </GroupPanel>
      <MultiPanel>
        <DetailForm />
      </MultiPanel>
      <CanvasPanel>
        <DetailForm />
      </CanvasPanel>
    </DetailPanel>
  );
};

export default FlowDetailPanel;