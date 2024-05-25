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

  // const onDrop = useCallback(
  //   (event) => {
  //     event.preventDefault();
  //     const reactFlowBounds = event.currentTarget.getBoundingClientRect();

  //     const nodeData = JSON.parse(
  //       event.dataTransfer.getData("application/reactflow")
  //     );

  //     const newNode = {
  //       id: `node-${nodes.length + 1}`, // Unique ID for the node
  //       type: nodeData.type,
  //       position: {
  //         x: event.clientX - reactFlowBounds.left,
  //         y: event.clientY - reactFlowBounds.top,
  //       },
  //       data: { label: nodeData.label },
  //     };

  //     setNodes((nds) => nds.concat(newNode));
  //   },
  //   [setNodes, nodes.length]
  // );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
  
      try {
        // Attempt to parse the JSON data transferred during the drop
        const nodeData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
  
        // Construct a new node object using the parsed data
        const newNode = {
          id: `node-${nodes.length + 1}`, // Unique ID for the node
          type: nodeData.type,
          position: {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          },
          data: { label: nodeData.label },
        };
  
        // Add the new node to the current array of nodes
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        message.error('Error adding node: Invalid data format.');
      }
    },
    [setNodes, nodes.length]  // Dependencies for useCallback
  );
  

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  function hasCycle(edges, nodeId, visited, recStack) {
    if (!visited[nodeId]) {
      visited[nodeId] = true;
      recStack[nodeId] = true;

      const nodeEdges = edges.filter((e) => e.source === nodeId);
      for (let edge of nodeEdges) {
        if (
          !visited[edge.target] &&
          hasCycle(edges, edge.target, visited, recStack)
        ) {
          return true;
        } else if (recStack[edge.target]) {
          return true;
        }
      }
    }
    recStack[nodeId] = false;
    return false;
  }

  function detectCycles(nodes, edges) {
    let visited = {};
    let recStack = {};
    for (let node of nodes) {
      if (hasCycle(edges, node.id, visited, recStack)) {
        return true;
      }
    }
    return false;
  }

  const handleSave = useCallback(() => {
    if (nodes.length > 1) {
      // Check if the flow contains cycles
      if (detectCycles(nodes, edges)) {
        message.error("Flow contains cycles.");
        return;
      }

      const nodesWithEmptyTargets = nodes.filter(
        (node) => !edges.some((edge) => edge.target === node.id)
      );

      if (nodesWithEmptyTargets.length > 1) {
        message.error("More than one node has empty target handles.");
        return;
      }
    }

    message.success("Changes saved successfully!");
  }, [nodes, edges]);

  const updateNodeLabel = useCallback((nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => 
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  }, [setNodes]);

  return (
    <ReactFlowProvider>
      <Layout>
        <AppHeader onSave={handleSave} />
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
              <Sidebar selectedNode={selectedNode} updateNodeLabel={updateNodeLabel}/>
            </Sider>
          </Layout>
        </Content>
      </Layout>
    </ReactFlowProvider>
  );
}

export default App;
