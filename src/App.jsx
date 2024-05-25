import React, { useState, useCallback, useMemo } from "react";
import { Layout, message } from "antd";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import AppHeader from "./components/Header/Header";
const { Content, Sider } = Layout;
import "./App.css";
import Sidebar from "./components/Siderbar/Sidebar";
import MessageNode from "./components/MessageNode/MessageNode";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = useMemo(() => ({ messageNode: MessageNode }), []);

  const onConnect = useCallback(
    (params) => {
      const existingEdgesFromSource = edges.filter(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (existingEdgesFromSource.length === 0) {
        // Only allow the new edge if there is no existing edge from this source handle
        setEdges((eds) => addEdge(params, eds));
      } else {
        message.info("Edge already exists from this source handle");
      }
    },
    [edges, setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeData = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      const newNode = {
        id: `node-${nodes.length + 1}`, // Unique ID for the node
        type: nodeData.type,
        position: {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        },
        data: { label: nodeData.label },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, nodes.length]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback((event, element) => {
    console.log(element);
    setSelectedNode(element);
  }, []);

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
              <Sidebar selectedNode={selectedNode} />
            </Sider>
          </Layout>
        </Content>
      </Layout>
    </ReactFlowProvider>
  );
}

export default App;
