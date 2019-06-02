import React from 'react';
import { Command } from 'gg-editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MenuItem = (props) => {
  const { command, icon, text } = props;

  return (
    <Command name={command}>
      <div className="chart-context">
        <FontAwesomeIcon icon={icon} />
        <span>{text || command}</span>
      </div>
    </Command>
  );
};

export default MenuItem;