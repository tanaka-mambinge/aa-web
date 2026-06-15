export interface User {
  id: string;
  workspace_id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token?: string | null;
  token_type?: string | null;
  user: User;
}

export interface ApprovalDecision {
  status: "approved" | "rejected" | "cancelled";
  resolved_at: string;
}

export interface Approval {
  id: string;
  workspace_id: string;
  requester_id: string;
  action: string;
  risk: "low" | "high" | "critical";
  status: "pending" | "approved" | "rejected" | "cancelled" | "timed_out";
  title: string;
  summary: string;
  extra: Record<string, unknown>;
  decision: ApprovalDecision | null;
  expires_at: string | null;
  cli_token_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApprovalListResponse {
  approvals: Approval[];
}

export interface CliToken {
  id: string;
  name: string;
  token_prefix: string;
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface CliTokenCreateResponse extends CliToken {
  token: string;
}
