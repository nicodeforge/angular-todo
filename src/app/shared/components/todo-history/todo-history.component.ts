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
import { User } from "../../../models/user.model";
import { UserService } from "../../../feature/user/services/user.service";
import { ListService } from "../../../feature/list/services/list.service";

@Component({
  selector: "app-todo-history",
  templateUrl: "./todo-history.component.html",
  styleUrls: ["./todo-history.component.scss"],
})
export class TodoHistoryComponent implements OnInit, OnDestroy {
  @Input() showHistory: boolean = false;
  @Input() showToggle: boolean = true;
  @Input() list!: List;
  @Input() lists!: List[];
  @Input() items!: Item[];
  @Output() itemUnarchived: EventEmitter<Item> = new EventEmitter<Item>();
  @Output() itemDeleted: EventEmitter<Item> = new EventEmitter<Item>();

  @Output() listUnarchived: EventEmitter<List> = new EventEmitter<List>();
  @Output() listDeleted: EventEmitter<List> = new EventEmitter<List>();

  public subscription!: Subscription;

  public user!: User;
  constructor(
    private archiveService: ArchiveService,
    private itemService: ItemService,
    private userService: UserService,
    private listService: ListService
  ) {}
  ngOnInit() {
    this.user = this.userService.getUser();
  }

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

  onUnarchiveList(list: List) {
    this.subscription = this.archiveService
      .unarchiveList(list)
      .subscribe((list) => {
        this.listUnarchived.emit(list);
      });
  }

  onDeleteList(list: List) {
    this.listService.delete(list).subscribe();
    this.listDeleted.emit(list);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
