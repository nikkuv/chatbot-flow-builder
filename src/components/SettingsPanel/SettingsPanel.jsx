import React, { useState } from 'react';
import { Input } from 'antd';

function SettingsPanel({ selectedNode, updateNodeLabel }) {
  const [label, setLabel] = useState(selectedNode.data.label);

  const handleInputChange = (e) => {
    setLabel(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      updateNodeLabel(selectedNode.id, label);
      e.target.blur();
    }
  };

  return (
    <div>
      <Input value={label} onChange={handleInputChange} onKeyDown={handleKeyDown} />
    </div>
  );
}
export default SettingsPanel;
