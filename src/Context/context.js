import React, { useState, createContext, useContext } from 'react';

const SelectedNodeContext = createContext();

function SelectedNodeProvider({ children }) {
    const [selectedNode, setSelectedNode] = useState(null);
    return (
        <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
            {children}
        </SelectedNodeContext.Provider>
    );
}

function useSelectedNode() {
    const context = useContext(SelectedNodeContext);
    if (context === undefined) {
        throw new Error('useSelectedNode must be used within a SelectedNodeProvider');
    }
    return context;
}

export default SelectedNodeContext;