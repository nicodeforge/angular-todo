import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { Item, ItemStatusEnum } from "../../../models/item.model";
import { List } from "../../../models/list.model";
import { ItemService } from "../../../services/item.service";
import { Subscription } from "rxjs";
import { ArchiveService } from "../../../feature/archive/services/archive.service";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
})
export class TodoListComponent implements OnDestroy {
  @Input() items!: Item[];

  @Input() list!: List;

  @Output() itemArchived: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemEditted: EventEmitter<Item> = new EventEmitter<Item>();
  public subscription!: Subscription;
  constructor(
    private itemService: ItemService,

    private archiveService: ArchiveService
  ) {}

  onArchiveItem(item: Item) {
    this.subscription = this.archiveService
      .archiveItem(item)
      .subscribe((item) => {
        this.itemArchived.next(item);
      });
  }

  onEditItem(item: Item) {
    console.log("emit item", item, "from todo-list");
    this.itemEditted.emit(item);
  }

  onClearList() {
    this.items.forEach((item) => {
      this.onArchiveItem(item);
    });
  }

  onItemDone(item: Item) {
    //this.todoService.markItemDone(item);
    item.status = ItemStatusEnum.DONE;
    item.completedAt = new Date(Date.now());
    this.subscription = this.itemService.update(item).subscribe();
  }

  onClearDone() {
    //this.todoService.archiveItemsDone();
    this.items
      .filter((item) => item.status === ItemStatusEnum.DONE)
      .forEach((item) => {
        this.onArchiveItem(item);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
