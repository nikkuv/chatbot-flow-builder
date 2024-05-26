import { useCallback } from "react";
import { Flex } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import styles from "./sidebar.module.css";
import SettingsPanel from "../SettingsPanel/SettingsPanel";
import { useFlowState } from "../../Context/context";

function Sidebar() {
  
  /**
   * The current selected node from the flow state.
   * This is used to highlight the node when it is selected in the flow.
   */
  const { selectedNode } = useFlowState();

  /**
   * Handles the dragstart event for the draggable node in the sidebar.
   * It sets the dataTransfer object with the node type and a default label
   * for the node being dragged.
   *
   * @param event The dragstart event.
   * @param nodeType The type of node being dragged.
   */
  const onDragStart = useCallback((event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, label: "New Node" })
    );
    event.dataTransfer.effectAllowed = "move";
  }, []);

  return (
    <div className={styles.sidebar}>
      {selectedNode ? (
        <SettingsPanel />
      ) : (
        <div>
          <div
            className={styles.draggableNode}
            onDragStart={(event) => onDragStart(event, "messageNode")}
            draggable
          >
            <Flex gap={4}>
              <MessageOutlined />
              Message
            </Flex>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
