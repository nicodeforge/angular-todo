import { List } from "./list.model";
import { Item } from "./item.model";

export interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  lists?: Record<string, List>;

  items?: Item[];
}
