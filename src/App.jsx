import React, { useCallback, useMemo } from "react";
import { Layout, message } from "antd";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import AppHeader from "./components/Header/Header";
import Sidebar from "./components/Siderbar/Sidebar";
import MessageNode from "./components/MessageNode/MessageNode";
import { useFlowState } from "./Context/context";
import "./App.css";

const { Content, Sider } = Layout;

function App() {

  /**
   * The `nodeTypes` object is used to define custom node types for the flow.
   * In this case, the only custom node type is the `messageNode` which is rendered
   * by the `MessageNode` component.
   */
  const nodeTypes = useMemo(() => ({ messageNode: MessageNode }), []);
  /**
   * The FlowState object is a React context that stores the state of the flow builder.
   * It contains the nodes, edges, and selectedNode properties which are used to manage the states.
   */
  const { nodes, setNodes, edges, setEdges, setSelectedNode } = useFlowState();

  /**
   * Callback function to handle changes to the nodes in the flow.
   * It applies the node changes to the nodes in the flow state using the
   * applyNodeChanges function from the react-flow library.
   *
   * @param changes The changes to the nodes.
   */
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  /**
   * Callback function to handle changes to the edges in the flow.
   * It applies the edge changes to the edges in the flow state using the
   * applyEdgeChanges function from the react-flow library.
   *
   * @param changes The changes to the edges.
   */
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  /**
   * Callback function to handle the connection of two nodes in the flow graph.
   * It checks if there is already an edge from the source node to the target node.
   * If there is not, it adds a new edge to the flow state using the addEdge function
   * from the react-flow library.
   *
   * @param params The parameters of the edge to be added.
   */
  const onConnect = useCallback(
    (params) => {
      const existingEdgesFromSource = edges.filter(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (existingEdgesFromSource.length === 0) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        message.info("Edge already exists from this source handle");
      }
    },
    [edges, setEdges]
  );

  /**
   * Handles the drop event for the react-flow component.
   * When a node is dropped onto the flow, it will add a new node to the flow state.
   * The new node is created from the data that is stored in the dataTransfer object
   * which is set when a node is dragged from the sidebar.
   *
   * @param event The drop event.
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
  
      try {
        const nodeData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
  
        const newNode = {
          id: `node-${nodes.length + 1}`, 
          type: nodeData.type,
          position: {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          },
          data: { label: nodeData.label },
        };
  
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        message.error('Error adding node: Invalid data format.');
      }
    },
    [setNodes, nodes.length]  
  );
  
  /**
   * Handles the dragover event for the react-flow component.
   * It sets the dropEffect property of the dataTransfer object to "move"
   * which will indicate to the user that the node can be dropped onto the flow.
   *
   * @param event The dragover event.
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Handles the click event for a node.
   * It sets the selectedNode state to the clicked node.
   *
   * @param event The click event for a node.
   * @param node The node that was clicked.
   */
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  /**
   * Handles the click event for the flow pane.
   * It clears the selectedNode state, which will hide the settings panel.
   *
   * @param event The click event for the flow pane.
   */
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <ReactFlowProvider>
      <Layout>
        <AppHeader />
        <Content>
          <Layout>
            <div className="reactfloWrapper">
              <ReactFlow
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </div>
            <Sider theme="light">
              <Sidebar />
            </Sider>
          </Layout>
        </Content>
      </Layout>
    </ReactFlowProvider>
  );
}

export default App;
