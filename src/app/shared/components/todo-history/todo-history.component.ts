import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Item } from "../../../models/item.model";
import { List } from "../../../models/list.model";
import { ArchiveService } from "../../../feature/archive/services/archive.service";
import { ItemService } from "../../../services/item.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-todo-history",
  templateUrl: "./todo-history.component.html",
  styleUrls: ["./todo-history.component.scss"],
})
export class TodoHistoryComponent implements OnInit, OnDestroy {
  @Input() showHistory: boolean = false;
  @Input() showToggle: boolean = true;
  @Input() list!: List;
  @Input() items!: Item[];
  @Output() itemUnarchived: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDeleted: EventEmitter<Item> = new EventEmitter<Item>();

  public subscription!: Subscription;
  constructor(
    private archiveService: ArchiveService,
    private itemService: ItemService
  ) {}
  ngOnInit() {}

  onUnarchiveItem(item: Item) {
    this.subscription = this.archiveService
      .unarchiveItem(item)
      .subscribe((item) => {
        this.itemUnarchived.emit(item);
      });
  }

  onShowHistory() {
    this.showHistory = !this.showHistory;
  }

  onDeleteAll() {
    this.items.forEach((item) => {
      this.onDeleteItem(item);
    });
  }

  onDeleteItem(item: Item) {
    this.itemService.delete(item).subscribe();
    this.itemDeleted.emit(item);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
