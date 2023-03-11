import { Injectable } from "@angular/core";
import { Item } from "../models/item.model";
import { List } from "../models/list.model";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() {}

  public save(key: string, item: any): void {
    item = JSON.stringify(item);
    localStorage.setItem(key, item);
  }

  public get(key: string): Array<any> | Item[] | List[] {
    let item = localStorage.getItem(key);
    if (null != item) {
      return JSON.parse(item);
    } else {
      return [];
    }
  }

  public update(key: string, item: any): void {
    let updatedItem!: any;
    const originalItem = this.get(key);
    console.log(originalItem);
    if (null != originalItem) {
      updatedItem = item;
    } else {
      updatedItem = item;
    }

    this.save(key, updatedItem);
  }
}
