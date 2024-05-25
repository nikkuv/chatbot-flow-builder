import { Layout, Typography, Flex, Button } from "antd";
import styles from "./header.module.css";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className={styles.header}>
      <Flex
        justify="space-between"
        align="center"
        className={styles.headerContent}
      >
        <Typography>Chatbot Flow Builder</Typography>
        <Button>Save Changes</Button>
      </Flex>
    </Header>
  );
};

export default AppHeader;
