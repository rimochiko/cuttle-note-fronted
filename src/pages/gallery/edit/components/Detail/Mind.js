import React from 'react';
import { NodePanel, CanvasPanel, DetailPanel } from 'gg-editor';
import DetailForm from './DetailForm';

const MindDetailPanel = () => {
  return (
    <DetailPanel>
      <NodePanel>
        <DetailForm type="node" />
      </NodePanel>
      <CanvasPanel>
      </CanvasPanel>
    </DetailPanel>
  );
};

export default MindDetailPanel;