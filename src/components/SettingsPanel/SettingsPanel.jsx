import React, { useState } from 'react';

function SettingsPanel({ selectedNode }) {
  const [label, setLabel] = useState(selectedNode.data.label);

  const handleInputChange = (e) => {
    setLabel(e.target.value);
    // Update the node label in your state or context that manages React Flow nodes
  };

  return (
    <div>
      <input type="text" value={label} onChange={handleInputChange} />
    </div>
  );
}
export default SettingsPanel;
