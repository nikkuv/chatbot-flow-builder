import { Layout, Typography, Flex, Button } from "antd";
import styles from "./header.module.css";
import { useFlowState } from "../../Context/context";

const { Header } = Layout;

const AppHeader = () => {

  /**
   * The `handleSave` function is a callback from the context,
   * it will save the current state of the flow to the local storage.
   * See the context for more info.
   */
  const { handleSave } = useFlowState();

  return (
    <Header className={styles.header}>
      <Flex
        justify="space-between"
        align="center"
        className={styles.headerContent}
      >
        <Typography>Chatbot Flow Builder</Typography>
        <Button onClick={handleSave}>Save Changes</Button>
      </Flex>
    </Header>
  );
};

export default AppHeader;
