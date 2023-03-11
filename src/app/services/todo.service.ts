import { Injectable } from "@angular/core";
import { Item, ItemStatusEnum } from "../models/item.model";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "./storage.service";
import {
  LOCAL_STORAGE_LISTS_ARCHIVE_KEY,
  LOCAL_STORAGE_LISTS_KEY,
} from "../constants";
import { v4 as uuidv4 } from "uuid";
import { List } from "../models/list.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  public $items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  public items: Item[] = [];
  public item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(new Item());

  public $itemArchive: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>(
    []
  );
  public itemArchive: Item[] = [];

  public $listArchive: BehaviorSubject<List[]> = new BehaviorSubject<List[]>(
    []
  );
  public listArchive: List[] = [];
  public $lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  public lists: List[] = [];

  public defaultList: List = new List("Not listed");
  //public $list: BehaviorSubject<List> = new BehaviorSubject<List>(new List());
  constructor(
    private storageService: StorageService,
    private http: HttpClient
  ) {}

  public addItem(item: Item) {
    item.id = this.getUuid();
    item.status = this.getItemStatus(item);
    if (item.listId) {
      this.addItemToList(item);
    }
    console.log("Add Item", item);

    this.items.push(item);
    this.saveItems();
  }

  public addList(list: List): void {
    list.id = this.getUuid();
    this.lists.push(list);
    this.saveLists();
  }

  public findListById(listId: string): List {
    const list = this.lists.find((list) => list.id === listId);
    if (list) {
      return list;
    }
    return {} as List;
  }

  public fetchItemsLocally(): void {
    //this.items = this.storageService.get(LOCAL_STORAGE_ITEMS_KEY) as Item[];
    this.http
      .get<Item[]>(
        "https://the-banette-default-rtdb.europe-west1.firebasedatabase.app/items.json"
      )
      .subscribe((items) => {
        if (items) {
          this.items = items;

          this.items = this.items.map((item) => {
            item.status = this.getItemStatus(item);
            if (null != item?.dueAt) {
              item.dueAt = new Date(<string>item.dueAt);
            }

            return item;
          });
          console.log("ITEMS REMOTE", this.items);
          if (null != this.items) {
            this.$items.next(this.items);
          }
        }
      });
  }

  public fetchListsLocally(): void {
    //this.lists = this.storageService.get(LOCAL_STORAGE_LISTS_KEY) as List[];

    this.http
      .get<List[]>(
        "https://the-banette-default-rtdb.europe-west1.firebasedatabase.app/lists.json"
      )
      .subscribe((lists) => {
        if (lists) {
          //this.lists = Object.values(lists)[0] as List[];
          this.lists = lists;
          console.log("RAW DATA", lists);
          console.log("LISTS REMOTE", this.lists);
        }
        if (null != this.lists) {
          this.$lists.next(this.lists);
        }
      });
  }

  public fetchArchiveLocally(listId?: string): void {
    //const archive = this.storageService.get(LOCAL_STORAGE_ITEMS_ARCHIVE_KEY);

    this.http
      .get<Item[]>(
        "https://the-banette-default-rtdb.europe-west1.firebasedatabase.app/items-archive.json"
      )
      .subscribe((archive) => {
        if (null != archive) {
          this.itemArchive = archive.map((item) => {
            if (null != item?.dueAt) {
              item.dueAt = new Date(<string>item.dueAt);
            }
            return item;
          });
          if (listId) {
            this.$itemArchive.next(
              this.itemArchive.filter((item) => item.listId === listId)
            );
          } else {
            this.$itemArchive.next(this.itemArchive);
          }
        }
      });
  }

  public archiveItem(item: Item): void {
    if (item.listId) {
      this.lists = this.lists.map((list) => {
        if (list.id === item.listId) {
          list.items = list.items.filter((it) => it.id != item.id);
        }
        return list;
      });
      this.saveLists();
    }
    this.itemArchive.push(item);
    this.saveItemsArchive();

    this.delete(item);
  }

  public delete(item: Item): void {
    this.items = this.items.filter((it) => it.id != item.id);
    this.saveItems();
  }

  private saveItems(): void {
    //this.storageService.save(LOCAL_STORAGE_ITEMS_KEY, this.items);
    this.http
      .put<Item[]>(
        "https://the-banette-default-rtdb.europe-west1.firebasedatabase.app/items.json",
        this.items
      )
      .subscribe((response) => {
        console.log(response);
      });

    this.$items.next(this.items);
  }

  private saveItemsArchive(): void {
    this.http
      .put<Item[]>(
        "https://the-banette-default-rtdb.europe-west1.firebasedatabase.app/items-archive.json",
        this.itemArchive
      )
      .subscribe();
    //this.storageService.save(LOCAL_STORAGE_ITEMS_ARCHIVE_KEY, this.itemArchive);
    this.$itemArchive.next(this.itemArchive);
  }
  private saveListsArchive(): void {
    this.storageService.save(LOCAL_STORAGE_LISTS_ARCHIVE_KEY, this.listArchive);
    this.$listArchive.next(this.listArchive);
  }

  public edit(item: Item) {
    this.item$.next(item);
  }

  public updateItem(item: Item): void {
    this.items = this.items.map((it) => {
      if (it.id === item.id) {
        item.status = this.getItemStatus(item);
        return item;
      } else {
        return it;
      }
    });

    this.saveItems();
  }

  deleteAll() {
    this.items = [];
    this.saveItems();
  }

  markItemDone(item: Item) {
    this.items = this.items.map((it) => {
      if (it.id === item.id) {
        it.status = ItemStatusEnum.DONE;
        it.completedAt = new Date(Date.now());
      }
      return it;
    });
    this.saveItems();
  }

  public clearItemsDone() {
    this.items = this.items.filter(
      (item) => item.status != ItemStatusEnum.DONE
    );
    this.saveItems();
  }

  private getItemStatus(item: Item): ItemStatusEnum {
    if (item.status === ItemStatusEnum.DONE) {
      return ItemStatusEnum.DONE;
    }
    if (item.dueAt && new Date(item.dueAt) < new Date(Date.now())) {
      return ItemStatusEnum.LATE;
    } else {
      return ItemStatusEnum.TODO;
    }
  }

  public unarchive(item: Item) {
    this.itemArchive = this.itemArchive.filter((it) => it.id != item.id);
    this.items.push(item);
    this.saveItems();
    this.saveItemsArchive();
  }

  archiveAll() {
    this.itemArchive.push(...this.items);
    this.items = [];
    this.saveItems();
    this.saveItemsArchive();
  }

  private getUuid(): string {
    return uuidv4();
  }

  archiveItemsDone() {
    const doneItems = this.items.filter(
      (item) => item.status === ItemStatusEnum.DONE
    );
    this.itemArchive.push(...doneItems);
    this.items = this.items.filter(
      (item) => item.status != ItemStatusEnum.DONE
    );
    this.saveItems();
    this.saveItemsArchive();
  }

  deleteArchive() {
    this.itemArchive = [];
    this.saveItemsArchive();
  }

  private saveLists() {
    this.storageService.save(LOCAL_STORAGE_LISTS_KEY, this.lists);
    this.$lists.next(this.lists);
    this.http
      .put(
        "https://the-banette-default-rtdb.europe-west1.firebasedatabase.app/lists.json",
        this.lists
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  private addItemToList(item: Item) {
    const listIndex = this.lists.findIndex((list) => list.id === item.listId);
    if (null != listIndex) {
      if (null != this.lists[listIndex]?.items) {
        this.lists[listIndex].items.push(item);
      } else {
        this.lists[listIndex]["items"] = [item];
      }
      console.log(this.lists[listIndex]);
      this.saveLists();
    }
  }

  public archiveList(listId: string): void {
    const listIndex = this.lists.findIndex((list) => list.id === listId);
    this.listArchive.push(this.lists[listIndex]);
    this.saveListsArchive();

    this.lists = this.lists.filter((list) => list.id != listId);
    this.saveLists();
  }
}
