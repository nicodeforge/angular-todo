export enum ItemStatusEnum {
  "DONE",
  "TODO",
  "LATE"
}

export class Item {
  id!: string;
  name!: string|null;
  status!: ItemStatusEnum;
  dueAt!: Date|null|string;
  completedAt?:Date|null;
}
