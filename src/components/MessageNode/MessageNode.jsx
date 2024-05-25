import { Flex, Typography } from "antd";
import { Handle, Position } from "reactflow";
import { MessageOutlined } from "@ant-design/icons";
import styles from "./messageNode.module.css";

const { Title } = Typography;

function MessageNode({ data }) {
  return (
    <div >
      <Handle type="target" position={Position.Left} />
      <Flex vertical className={styles.messageNode}>
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
