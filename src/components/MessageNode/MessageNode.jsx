import { Handle, Position } from "reactflow";
import { Flex, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import styles from "./messageNode.module.css";
import { useFlowState } from "../../Context/context";

/**
 * A custom node that can be dragged and dropped anywhere in the flow.
 * It takes two props: `id` and `data`.
 * - `id`: a unique ID for the node.
 * - `data`: an object containing the node's metadata. The only required property is
 *   `label`, which is the text displayed inside the node.
 */

function MessageNode({ id, data }) {
  
  /**
   * The current selected node from the flow state.
   * This is used to highlight the node when it is selected in the flow.
   */
  const { selectedNode } = useFlowState();

  return (
    <div id={id}>
      <Handle type="target" position={Position.Left} />
      <Flex
        vertical
        className={`${styles.messageNode} ${
          selectedNode?.id === id ? styles.messageNodeSelected : ""
        }`}
      >
        <Flex gap={4} className={styles.messageHeader}>
          <MessageOutlined />
          <Typography>Send Messages</Typography>
        </Flex>
        <div className={styles.messageBody}>{data.label}</div>
      </Flex>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default MessageNode;
