export interface Workspace {
  name: string;
  ownerId: string;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}

export interface GoalList {
  title: string;
  createdBy: string;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}

export type GoalStatus = "open" | "close";

export interface Goal {
  listId: string;
  title: string;
  description?: string;
  status: GoalStatus;
  dueDate?: Date | string | null;
  createdBy: string;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}
