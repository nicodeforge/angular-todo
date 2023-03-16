import { Injectable } from "@angular/core";
import { ItemRepository } from "../repositories/item.repository";
import { BehaviorSubject, map, Observable } from "rxjs";
import { CreateItem, Item } from "../models/item.model";
import { UserRepository } from "../repositories/user.repository";
import { List } from "../models/list.model";
import { UserService } from "../feature/user/services/user.service";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class ItemService {
  public items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  constructor(
    private itemRepository: ItemRepository,
    private readonly userService: UserService
  ) {
    this.userService.user$
      .pipe(
        map((user: User) => {
          return user?.items;
        })
      )
      .subscribe((items) => {
        if (items) {
          console.log("Items from service", Object.values(items));
          this.items.next(Object.values(items));
        }
      });
  }

  public save(item: CreateItem): Promise<void> {
    return this.userService.addItem(item);
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
