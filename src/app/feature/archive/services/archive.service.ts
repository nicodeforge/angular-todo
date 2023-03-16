import { Injectable } from "@angular/core";
import { Item } from "../../../models/item.model";
import { Observable } from "rxjs";
import { ItemRepository } from "../../../repositories/item.repository";
import { List } from "../../../models/list.model";
import { ListRepository } from "../../../repositories/list.repository";

@Injectable({
  providedIn: "root",
})
export class ArchiveService {
  constructor(
    private itemRepository: ItemRepository,
    private listRepository: ListRepository
  ) {}
  public archiveItem(item: Item): Observable<Item> {
    item.isArchived = true;
    return this.itemRepository.update(item);
  }

  public unarchiveItem(item: Item): Observable<Item> {
    item.isArchived = false;
    return this.itemRepository.update(item);
  }

  public archiveList(list: List): Observable<List> {
    list.isArchived = true;
    return this.listRepository.update(list);
  }

  public unarchiveList(list: List): Observable<List> {
    list.isArchived = false;
    return this.listRepository.update(list);
  }
}
