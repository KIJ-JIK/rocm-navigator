"use client";

import React, { useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  MarkerType,
  Controls,
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { 
  Search, 
  Layers, 
  Code, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  FileText,
  AlertTriangle
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<any>> = {
  Search,
  Layers,
  Code,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  FileText
};

// Custom Node matching the n8n node card styling
const CustomAgentNode = ({ data }: { data: any }) => {
  const { label, agentName, active, completed, iconName, warnings } = data;
  const Icon = ICONS[iconName];

  // Wine-glass capsule styling matching Image 2 Gantt blocks
  let borderStyle = "border-[#4e1c22]/35 bg-[#1b080b]/90 text-[#9d7d82]";
  let leftIndicator = "bg-zinc-700";
  let statusBadge = null;

  if (active) {
    borderStyle = "border-[#cc4155]/60 bg-[#2d1115]/95 text-white shadow-[0_0_15px_rgba(204,65,85,0.25)]";
    leftIndicator = "bg-[#cc4155]";
    statusBadge = (
      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#cc4155] text-[7px] font-bold text-white animate-pulse border border-[#1b080b]">
        ●
      </span>
    );
  } else if (completed) {
    borderStyle = "border-emerald-500/50 bg-[#1b080b]/90 text-[#fbd6cb]";
    leftIndicator = "bg-emerald-500";
    statusBadge = (
      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white border border-[#1b080b]">
        ✓
      </span>
    );
  } else {
    // idle state indicators
    leftIndicator = "bg-[#4e1c22]/60";
  }

  // Generate mock avatar colors based on node label to match Image 2 stack
  const getAvatarColors = () => {
    switch (label) {
      case "Scanner": return ["bg-blue-500", "bg-pink-500"];
      case "Architecture": return ["bg-purple-500", "bg-amber-500"];
      case "Rewrite": return ["bg-rose-500", "bg-emerald-500"];
      case "Security": return ["bg-yellow-500", "bg-sky-500"];
      case "Validation": return ["bg-emerald-500", "bg-violet-500"];
      case "Performance": return ["bg-teal-500", "bg-orange-500"];
      default: return ["bg-zinc-500", "bg-pink-500"];
    }
  };

  const avatars = getAvatarColors();

  return (
    <div className={`relative flex items-center h-[52px] min-w-[190px] rounded-lg border text-left transition-all duration-300 shadow-lg ${borderStyle}`}>
      {/* Input Handle */}
      {label !== "Scanner" && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="!w-2 !h-2 !bg-[#4e1c22] !border-[#e35b6e]/30 hover:!bg-[#cc4155] transition-colors" 
        />
      )}

      {/* Left Color Indicator Bar (Image 2 Style) */}
      <div className={`w-1.5 h-full rounded-l-md ${leftIndicator}`} />

      {/* Node Main Content */}
      <div className="flex flex-1 items-center justify-between gap-2 px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#150507] border border-[#4e1c22]/40">
            {Icon && <Icon className={`h-3.5 w-3.5 ${active ? "text-[#cc4155]" : completed ? "text-emerald-400" : "text-[#9d7d82]/60"}`} />}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white font-bold leading-tight">{label}</span>
            <span className="text-[7px] text-[#9d7d82] font-semibold uppercase tracking-wider">{agentName.split(" ")[0]}</span>
          </div>
        </div>

        {/* Avatars group stack on the right matching Image 2 */}
        <div className="avatar-group-stack">
          <div className={`size-4.5 rounded-full ${avatars[0]} text-[6px] font-bold text-white flex items-center justify-center border border-[#1b080b] shadow-sm uppercase`}>
            {label[0]}
          </div>
          <div className={`size-4.5 rounded-full ${avatars[1]} text-[6px] font-bold text-white flex items-center justify-center border border-[#1b080b] shadow-sm uppercase -mr-1.5`}>
            {label[1] || "A"}
          </div>
        </div>
      </div>

      {/* Status Warning Icon */}
      {warnings && warnings.length > 0 && (
        <div className="absolute -bottom-1.5 -left-1.5 flex items-center justify-center rounded bg-amber-500 p-0.5 text-white animate-bounce shadow">
          <AlertTriangle className="h-2.5 w-2.5" />
        </div>
      )}

      {/* Dynamic Status Badges */}
      {statusBadge}

      {/* Output Handle */}
      {label !== "Reports" && (
        <Handle 
          type="source" 
          position={Position.Right} 
          className="!w-2 !h-2 !bg-[#4e1c22] !border-[#e35b6e]/30 hover:!bg-[#cc4155] transition-colors" 
        />
      )}
    </div>
  );
};

interface AgentFlowProps {
  activeAgent: string;
  progress: number;
  isMigrating: boolean;
}

export default function AgentFlow({ activeAgent, progress, isMigrating }: AgentFlowProps) {
  const nodeTypes = useMemo(() => ({
    agentNode: CustomAgentNode
  }), []);

  const getAgentStatus = (agentName: string) => {
    const thresholds: Record<string, number> = {
      "Scanner Agent": 15,
      "Architecture Agent": 30,
      "Rewrite Agent": 55,
      "Security Agent": 70,
      "Validation Agent": 85,
      "Performance Agent": 95,
      "Report Agent": 100
    };
    
    const active = isMigrating && activeAgent === agentName;
    const completed = progress >= thresholds[agentName] && !active;
    return { active, completed };
  };

  const initialNodes = [
    {
      id: "scanner",
      type: "agentNode",
      position: { x: 30, y: 120 },
      data: { label: "Scanner", agentName: "Scanner Agent", iconName: "Search", ...getAgentStatus("Scanner Agent") }
    },
    {
      id: "architecture",
      type: "agentNode",
      position: { x: 230, y: 120 },
      data: { label: "Architecture", agentName: "Architecture Agent", iconName: "Layers", ...getAgentStatus("Architecture Agent") }
    },
    {
      id: "rewrite",
      type: "agentNode",
      position: { x: 430, y: 120 },
      data: { label: "Rewrite", agentName: "Rewrite Agent", iconName: "Code", ...getAgentStatus("Rewrite Agent") }
    },
    {
      id: "security",
      type: "agentNode",
      position: { x: 630, y: 45 },
      data: { label: "Security", agentName: "Security Agent", iconName: "ShieldAlert", ...getAgentStatus("Security Agent") }
    },
    {
      id: "validation",
      type: "agentNode",
      position: { x: 630, y: 195 },
      data: { label: "Validation", agentName: "Validation Agent", iconName: "CheckCircle2", ...getAgentStatus("Validation Agent") }
    },
    {
      id: "performance",
      type: "agentNode",
      position: { x: 830, y: 120 },
      data: { label: "Performance", agentName: "Performance Agent", iconName: "Cpu", ...getAgentStatus("Performance Agent") }
    },
    {
      id: "reports",
      type: "agentNode",
      position: { x: 1030, y: 120 },
      data: { label: "Reports", agentName: "Report Agent", iconName: "FileText", ...getAgentStatus("Report Agent") }
    }
  ];

  const initialEdges = [
    { id: "e1-2", source: "scanner", target: "architecture" },
    { id: "e2-3", source: "architecture", target: "rewrite" },
    { id: "e3-4", source: "rewrite", target: "security" },
    { id: "e3-5", source: "rewrite", target: "validation" },
    { id: "e4-6", source: "security", target: "performance" },
    { id: "e5-6", source: "validation", target: "performance" },
    { id: "e6-7", source: "performance", target: "reports" }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const updatedNodes = initialNodes.map(node => {
      const { active, completed } = getAgentStatus(node.data.agentName);
      return {
        ...node,
        data: {
          ...node.data,
          active,
          completed
        }
      };
    });

    const updatedEdges = initialEdges.map(edge => {
      const { completed: srcCompleted } = getAgentStatus(updatedNodes.find(n => n.id === edge.source)?.data.agentName || "");
      const { active: srcActive } = getAgentStatus(updatedNodes.find(n => n.id === edge.source)?.data.agentName || "");
      
      let edgeColor = "#27272a"; 
      let isAnimated = false;

      if (srcCompleted) {
        edgeColor = "#10b981"; // Emerald
      } else if (srcActive) {
        edgeColor = "#871717"; // Primary Crimson Red
        isAnimated = true;
      }

      return {
        ...edge,
        animated: isAnimated,
        style: { stroke: edgeColor, strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
          width: 10,
          height: 10
        }
      };
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [activeAgent, progress, isMigrating]);

  return (
    <div className="h-full w-full bg-zinc-950/90 rounded-lg overflow-hidden border border-zinc-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.5}
        maxZoom={1.5}
        panOnScroll={false}
        zoomOnScroll={false}
        panOnDrag={true}
        preventScrolling={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#333335" />
        <Controls 
          showInteractive={false} 
          className="!bg-zinc-900 !border-zinc-800 !shadow-lg [&>button]:!bg-zinc-900 [&>button]:!border-zinc-800 [&>button]:!text-zinc-400 [&>button]:hover:!text-white" 
        />
      </ReactFlow>
    </div>
  );
}
