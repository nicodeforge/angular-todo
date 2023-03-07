import {Injectable} from '@angular/core';
import {Item, ItemStatusEnum} from "../models/item.model";
import {BehaviorSubject} from "rxjs";
import {StorageService} from "./storage.service";
import {LOCAL_STORAGE_ARCHIVE_KEY, LOCAL_STORAGE_ITEMS_KEY} from "../constants";
import {v4 as uuidv4} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public $items:BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  public items:Item[] = [];
  public item$:BehaviorSubject<Item> = new BehaviorSubject<Item>(new Item());

  public $archive:BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  public archive:Item[] = [];
  constructor(private storageService:StorageService) { }

  public addItem(item: Item) {

    item.id = this.getUuid();
    item.status = this.getItemStatus(item);

    this.items.push(item);
    this.save()
  }

  public fetchItemsLocally():void{
  this.items = this.storageService.get(LOCAL_STORAGE_ITEMS_KEY);
    this.items = this.items.map((item) => {
      item.status = this.getItemStatus(item);
      if(null != item?.dueAt){
        item.dueAt = new Date(<string>item.dueAt);
      }

      return item;
    })
    console.log(this.items);
    if(null != this.items){
      this.$items.next(this.items);
    }
  }

  public fetchArchive():void{
    const archive = this.storageService.get(LOCAL_STORAGE_ARCHIVE_KEY);
    this.archive = archive.map((item) => {
      if(null != item?.dueAt){
      item.dueAt = new Date(<string>item.dueAt);
    }
      return item;
    });
    this.$archive.next(this.archive);
  }

  public archiveItem(item:Item):void{
    this.archive.push(item);
    this.saveArchive();
  }

  public delete(item: Item):void {
    this.items = this.items.filter((it) => it.id != item.id);
    this.save();
  }

  private save():void{
    this.storageService.save(LOCAL_STORAGE_ITEMS_KEY,this.items);
    this.$items.next(this.items);
  }

  private saveArchive():void{
    this.storageService.save(LOCAL_STORAGE_ARCHIVE_KEY,this.archive);
    this.$archive.next(this.archive);
  }

  public edit(item: Item) {
    this.item$.next(item);

  }

  public updateItem(item: Item):void {
    this.items = this.items.map((it) => {
      if(it.id === item.id){
        item.status = this.getItemStatus(item);
        return item
      }else{
        return it;
      }
    })

    this.save();
  }

  deleteAll() {
    this.items = [];
    this.save();
  }

  markItemDone(item: Item) {
    this.items = this.items.map((it) => {
      if(it.id === item.id){
        it.status = ItemStatusEnum.DONE;
        it.completedAt = new Date(Date.now())
      }
      return it;
    });
    this.save();
  }

  public clearItemsDone() {
    this.items = this.items.filter((item) => item.status != ItemStatusEnum.DONE);
    this.save()
  }

  private getItemStatus(item: Item):ItemStatusEnum {
    if(item.status === ItemStatusEnum.DONE){
      return ItemStatusEnum.DONE;
    }
    if(item.dueAt && new Date(item.dueAt) < new Date(Date.now())){
      return ItemStatusEnum.LATE;
    }else{
      return ItemStatusEnum.TODO;
    }
  }

  public unarchive(item: Item) {
    this.archive = this.archive.filter((it) => it.id != item.id);
    this.items.push(item);
    this.save();
    this.saveArchive();

  }

  archiveAll() {
    this.archive.push(...this.items);
    this.items = [];
    this.save();
    this.saveArchive();
  }

  private getUuid():string {
    return uuidv4();
  }

  archiveItemsDone() {
    const doneItems = this.items.filter((item) => item.status === ItemStatusEnum.DONE)
    this.archive.push(...doneItems);
    this.items = this.items.filter((item) => item.status != ItemStatusEnum.DONE);
    this.save();
    this.saveArchive();
  }

  deleteArchive() {
    this.archive = [];
    this.saveArchive();
  }
}
