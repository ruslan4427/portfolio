export type AgentNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  accent?: boolean;
};

export type AgentEdge = {
  id: string;
  from: string;
  to: string;
};

export type ReplayStep = {
  title: string;
  edge?: string;
  activeNodes: string[];
  payload: string;
  timestamp?: string;
};

export type ReplayData = {
  slug: string;
  title: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
  steps: ReplayStep[];
  viewBox: { width: number; height: number };
};
