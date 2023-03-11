import { List } from "./list.model";
import { Item } from "./item.model";

export class Archive {
  id!: string;
  lists!: List[];
  items!: Item[];
}
