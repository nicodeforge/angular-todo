import { Injectable } from "@angular/core";
import { ItemRepository } from "../repositories/item.repository";
import { Observable } from "rxjs";
import { CreateItem, Item } from "../models/item.model";

@Injectable({
  providedIn: "root",
})
export class ItemService {
  constructor(private itemRepository: ItemRepository) {}

  public save(item: CreateItem): Observable<Item> {
    return this.itemRepository.save(item);
  }

  public update(item: Item): Observable<Item> {
    return this.itemRepository.update(item);
  }

  public findById(itemId: string): Observable<Item> {
    return this.itemRepository.findById(itemId);
  }

  public findByListId(listId: string): Observable<Item[]> {
    return this.itemRepository.findByListId(listId);
  }

  public findAll(): Observable<Item[]> {
    return this.itemRepository.findAll();
  }

  public delete(item: Item): Observable<any> {
    return this.itemRepository.delete(item);
  }
}
