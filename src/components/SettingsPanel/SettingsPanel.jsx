import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Input, Flex, Typography, Button } from "antd";
import { useFlowState } from "../../Context/context";

const { TextArea } = Input;

function SettingsPanel() {
  /**
   * The current selected node from the flow state.
   * This is used to get the label of the selected node and update it when the user
   * presses the enter key.
   */
  const { selectedNode, updateNodeLabel } = useFlowState();
  const [label, setLabel] = useState(selectedNode.data.label || "");

  /**
   * This effect is triggered whenever the selectedNode changes.
   * If the selectedNode is not null, it updates the label state with the label of the selectedNode.
   */
  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
    }
  }, [selectedNode]);

  const handleInputChange = (e) => {
    setLabel(e.target.value);
  };


  /**
   * Handles the enter key press event on the text area.
   * When the enter key is pressed, it updates the label of the selected node
   * using the `updateNodeLabel` function from the context, and then blurs the
   * text area to prevent the user from editing the label again.
   *
   * @param e The enter key press event.
   */
  const handleUpdate = (e) => {
    if (e.key === "Enter") {
      updateNodeLabel(selectedNode.id, label);
      e.target.blur();
    }
  };

  return (
    <Flex vertical gap={16}>
      <Flex gap={4}>
        <ArrowLeftOutlined />
        <Typography>Messages</Typography>
      </Flex>
      <Flex vertical gap={32}>
        <TextArea
          value={label}
          onChange={handleInputChange}
          onKeyDown={handleUpdate}
          maxLength={500}
          showCount
        />
        <Button
          type="primary"
          onClick={() => updateNodeLabel(selectedNode.id, label)}
        >
          Edit
        </Button>
      </Flex>
    </Flex>
  );
}
export default SettingsPanel;
