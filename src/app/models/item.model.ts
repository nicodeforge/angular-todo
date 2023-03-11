export enum ItemStatusEnum {
  "DONE",
  "TODO",
  "LATE",
}

export interface CreateItem {
  name: string;
  status: ItemStatusEnum;
  createdAt: Date | string;
  dueAt: Date | null | string;
  completedAt?: Date | null;
  listId: string;

  isArchived: boolean;
}

export class Item {
  id!: string;
  name!: string;
  status!: ItemStatusEnum;
  createdAt!: Date | string;
  dueAt!: Date | null | string;
  completedAt?: Date | null;
  listId!: string;
  isArchived?: boolean = false;
}
