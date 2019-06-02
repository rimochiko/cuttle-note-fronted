import React, { Component } from 'react'
import { Command } from 'gg-editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ToolbarButton extends Component {
  render () {
    const { command,icon,text } = this.props;
      
  
      if (icon) {
        return (
          <Command name={command}>
              <FontAwesomeIcon icon={icon} />
          </Command>
        );    
      } else {
        return (
          <Command name={command}>
              {text}
          </Command>
        )
      }
    }
  }

export default ToolbarButton;