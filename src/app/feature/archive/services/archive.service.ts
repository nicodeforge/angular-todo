import { Injectable } from "@angular/core";
import { Item } from "../../../models/item.model";
import { Observable } from "rxjs";
import { ItemRepository } from "../../../repositories/item.repository";

@Injectable({
  providedIn: "root",
})
export class ArchiveService {
  constructor(private itemRepository: ItemRepository) {}
  public archiveItem(item: Item): Observable<Item> {
    item.isArchived = true;
    return this.itemRepository.update(item);
  }

  public unarchiveItem(item: Item): Observable<Item> {
    item.isArchived = false;
    return this.itemRepository.update(item);
  }
}
