import { useCallback } from 'react';
import { Flex, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import styles from './sidebar.module.css';
import SettingsPanel from '../SettingsPanel/SettingsPanel';

function Sidebar({ selectedNode, updateNodeLabel }) {

  const onDragStart = useCallback((event, nodeType) => {
    console.log(event.dataTransfer);
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label: 'New Node' }));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <div className={styles.sidebar}>
      {selectedNode ? 
        <SettingsPanel selectedNode={selectedNode} updateNodeLabel={updateNodeLabel} /> :
        <div>
          <div className={styles.draggableNode} onDragStart={(event) => onDragStart(event, 'messageNode')} draggable>
            <Flex gap={4}>
              <MessageOutlined />
              Message
            </Flex>
          </div>
        </div>
      }
      {/* More nodes can be added here */}
    </div>
  );
}

export default Sidebar;
