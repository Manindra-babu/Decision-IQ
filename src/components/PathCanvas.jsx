import { useMemo, useEffect, useState, useCallback } from 'react';
import dagre from 'dagre';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomGlassNode from './CustomGlassNode';

const nodeTypes = { customGlassNode: CustomGlassNode };

// Converts the backend DAG format to React Flow nodes/edges using Dagre
const generateGraphElements = (gemmaData) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Set the direction to Top-Down (TB)
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 150 });

  const nodes = [];
  const edges = [];
  
  if (!gemmaData || !gemmaData.nodes) return { nodes, edges };

  // 1. Create nodes and edges
  gemmaData.nodes.forEach((node) => {
    // Add to React Flow nodes array
    nodes.push({
      id: node.id,
      type: 'customGlassNode', 
      data: { label: node.label, action: node.description, track: node.track },
      position: { x: 0, y: 0 } // Dagre will calculate this!
    });

    // Add to Dagre for calculation
    dagreGraph.setNode(node.id, { width: 250, height: 100 });

    // 2. Create connecting lines based on prerequisites
    if (node.depends_on && node.depends_on.length > 0) {
      node.depends_on.forEach((prereqId) => {
        edges.push({
          id: `e-${prereqId}-${node.id}`,
          source: prereqId,
          target: node.id,
          animated: true,
          style: { stroke: '#0ff', strokeWidth: 2 }
        });
        dagreGraph.setEdge(prereqId, node.id);
      });
    }
  });

  // 3. Let Dagre calculate the layout
  dagre.layout(dagreGraph);

  // 4. Apply the calculated X/Y positions back to React Flow nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 125, // offset by half width to center
      y: nodeWithPosition.y - 50   // offset by half height to center
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

export default function PathCanvas({ treeData }) {
  // Use React Flow hooks to manage state
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateGraphElements(treeData), [treeData]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  // Sync state if backend data updates
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateGraphElements(treeData);
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNode(null);
  }, [treeData, setNodes, setEdges]);
  
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  if (!treeData) {
      return (
          <div className="w-full h-[500px] flex items-center justify-center bg-[#0a0a0a] border border-[#333] rounded-sm">
              <p className="text-[#0ff] font-bold uppercase tracking-widest text-xs opacity-70">Waiting for AI Path Data...</p>
          </div>
      )
  }

  return (
    <div className="w-full h-[600px] bg-[#0a0a0a] border border-[#333] shadow-inner rounded-sm overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <Background color="#333" gap={16} />
      </ReactFlow>
      
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 border border-cyan-900/50 rounded-sm shadow-[0_0_10px_rgba(0,255,255,0.2)] pointer-events-none z-10">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#0ff]">Cinematic Path Map</h3>
      </div>
      
      {/* Node Detail Side Panel */}
      {selectedNode && (
        <div className="absolute top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-xl border-l border-[#0ff]/30 shadow-[-10px_0_20px_rgba(0,255,255,0.1)] p-6 z-20 flex flex-col animate-fade-in-up">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-[#0ff] text-xl font-black uppercase tracking-widest leading-tight">{selectedNode.data.label}</h2>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Node Type</h3>
                    <div className="inline-block bg-[#0ff]/10 text-[#0ff] px-3 py-1 rounded-sm border border-[#0ff]/30 text-xs font-bold uppercase tracking-widest">
                        {selectedNode.data.action || 'Overview'}
                    </div>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Recommended Actions</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start text-sm text-slate-300">
                            <span className="text-[#0ff] mr-2 mt-0.5">▸</span>
                            Search for "{selectedNode.data.label}" courses on Udemy or Coursera.
                        </li>
                        <li className="flex items-start text-sm text-slate-300">
                            <span className="text-[#0ff] mr-2 mt-0.5">▸</span>
                            Look up recent projects or GitHub repos related to this topic.
                        </li>
                    </ul>
                </div>
                
                <div className="mb-6">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="w-5 h-5 border-2 border-[#0ff]/50 rounded-sm flex items-center justify-center group-hover:border-[#0ff] transition-colors">
                            {/* Empty checkbox visually */}
                        </div>
                        <span className="text-sm font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">Mark as Completed</span>
                    </label>
                </div>
            </div>
            
            <button className="w-full bg-[#0ff] text-black font-black uppercase tracking-widest py-3 rounded-sm hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all mt-4 cursor-pointer">
                Explore Resources
            </button>
        </div>
      )}
    </div>
  );
}
