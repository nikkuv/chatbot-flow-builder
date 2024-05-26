import React, { createContext, useContext, useState, useCallback } from "react";
import { message } from "antd";

/**
 * The context that contains the state of the chatbot flow builder.
 * All components that need access to the flow state should use this context.
 */
const FlowStateContext = createContext();

/**
 * Hook that provides the flow state to the components.
 * It can only be used within a FlowStateProvider.
 *
 * @returns The flow state.
 */
export const useFlowState = () => {
  const context = useContext(FlowStateContext);
  if (!context) {
    throw new Error("useFlowState must be used within a FlowStateProvider");
  }
  return context;
};

export const FlowStateProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  /**
   * Updates the label of a node in the flow state.
   *
   * @param nodeId The ID of the node to update.
   * @param newLabel The new label to give to the node.
   */
  const updateNodeLabel = useCallback((nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  }, []);

  /**
   * Checks if there is a cycle in the flow graph.
   * A cycle is a path of edges that starts and ends at the same node.
   * It checks if the given nodeId is part of a cycle.
   *
   * @param edges The list of edges in the flow graph.
   * @param nodeId The ID of the node to check for a cycle.
   * @param visited A map of all visited nodes. Used to detect cycles.
   * @param recStack A map of all nodes currently in the recursion stack.
   * @returns True if there is a cycle, false otherwise.
   */
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

  /**
   * Checks if the given flow graph contains cycles.
   *
   * @param nodes The list of nodes in the flow graph.
   * @param edges The list of edges in the flow graph.
   * @returns True if there is a cycle, false otherwise.
   */
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

  /**
   * Saves the current state of the flow.
   *
   * Before saving, it checks for two things:
   * - If the flow contains cycles. If so, it displays an error message and returns.
   * - If there is more than one node with empty target handles. If so, it displays an error message and returns.
   * If everything is good, it displays a success message.
   */
  const handleSave = useCallback(() => {
    if (nodes.length > 1) {
      // Check if the flow contains cycles
      if (detectCycles(nodes, edges)) {
        message.error("Flow contains cycles.");
        return;
      }

      // Check if there is more than one node with empty target handles
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

  const value = {
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedNode,
    setSelectedNode,
    updateNodeLabel,
    handleSave,
  };

  return (
    <FlowStateContext.Provider value={value}>
      {children}
    </FlowStateContext.Provider>
  );
};
