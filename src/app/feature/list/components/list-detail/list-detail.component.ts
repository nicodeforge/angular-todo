import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "../../../../models/list.model";
import { Subscription } from "rxjs";
import { Item } from "../../../../models/item.model";
import { User } from "../../../../models/user.model";
import { UserService } from "../../../user/services/user.service";
import { ItemService } from "../../../../services/item.service";

@Component({
  selector: "app-list-detail",
  templateUrl: "./list-detail.component.html",
  styleUrls: ["./list-detail.component.scss"],
})
export class ListDetailComponent implements OnInit, OnDestroy {
  public user!: User;
  public list!: List;
  public items!: Item[];
  private listSubscription!: Subscription;
  public activeItems!: Item[];
  public archivedItems!: Item[];
  public itemEditted: EventEmitter<Item> = new EventEmitter<Item>();
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private itemService: ItemService
  ) {}
  ngOnInit() {
    this.listSubscription = this.route.data.subscribe((data) => {
      this.list = data["list"];
      this.items = data["items"];
      console.log("list-detail items", this.items);
      this.activeItems = this.items.filter((item) => !item.isArchived);
      this.archivedItems = this.items.filter((item) => item.isArchived);

      this.itemService.items.subscribe((items) => {
        if (items) {
          this.items = items.filter(
            (items) => items.listId === data["list"].id
          );
          this.activeItems = this.items.filter((item) => !item.isArchived);
          this.archivedItems = this.items.filter((item) => item.isArchived);
          console.log("Items set", this.items);
        }
      });
    });

    this.user = this.userService.getUser();
  }

  ngOnDestroy() {
    this.listSubscription.unsubscribe();
  }

  onItemAdded(item: Item) {
    this.activeItems.push(item);
  }

  onItemArchived(item: Item) {
    this.activeItems = this.activeItems.filter((it) => it.id != item.id);
    this.archivedItems.push(item);
  }

  onItemUnarchived(item: Item) {
    this.archivedItems = this.archivedItems.filter((it) => it.id != item.id);
    this.activeItems.push(item);
  }

  public onItemDeleted(item: Item) {
    this.activeItems = this.activeItems.filter((it) => it.id != item.id);
    this.archivedItems = this.archivedItems.filter((it) => it.id != item.id);
  }

  onItemEdittedStart(item: Item) {
    this.itemEditted.emit(item);
  }

  onItemEdittedEnd(item: Item) {
    const itemIndex = this.activeItems.findIndex((it) => it.id === item.id);
    this.activeItems[itemIndex] = item;
  }
}
