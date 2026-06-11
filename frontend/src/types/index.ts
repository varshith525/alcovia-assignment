export type SessionStatus = "running" | "success" | "failed";

export interface FocusSession {
  id: string;
  targetMinutes: number;
  startTime: number;
  endTime?: number;
  status: SessionStatus;
  failReason?: "give_up" | "app_switch";
  synced: boolean;
}

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}