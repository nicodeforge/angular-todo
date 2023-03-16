import { Item } from "./item.model";
import { v4 as uuidv4 } from "uuid";
export class List {
  public id!: string;
  public items: Item[] = [];

  public ownedByUserId!: string;
  public sharedWithUserId!: string[];

  public users!: Record<string, boolean>;
  public isArchived: boolean = false;

  constructor(public name: string) {
    this.id = this.generateUUID();
  }

  private generateUUID(): string {
    return uuidv4();
  }
}
