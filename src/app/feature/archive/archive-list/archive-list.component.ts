import { Component, OnDestroy, OnInit } from "@angular/core";
import { Item } from "../../../models/item.model";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ArchiveService } from "../services/archive.service";
import { ItemService } from "../../../services/item.service";
import { List } from "../../../models/list.model";
import { ListService } from "../../list/services/list.service";

@Component({
  selector: "app-archive-list",
  templateUrl: "./archive-list.component.html",
  styleUrls: ["./archive-list.component.scss"],
})
export class ArchiveListComponent implements OnInit, OnDestroy {
  public items!: Item[];
  public lists!: List[];
  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private archiveService: ArchiveService,
    private itemService: ItemService,
    private listService: ListService
  ) {}

  ngOnInit() {
    this.sub = this.route.data.subscribe((data) => {
      this.items = data["items"].filter((item: Item) => item.isArchived);
    });
    this.listService.findAll().subscribe((lists) => {
      this.lists = lists.filter((list) => list.isArchived);
      console.log(this.lists);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onItemUnarchived(item: Item): void {
    this.items = this.items.filter((it) => it.id != item.id);
  }

  public onItemDeleted(item: Item): void {
    this.items = this.items.filter((it) => it.id != item.id);
  }

  onListUnarchived(list: List) {
    this.lists = this.lists.filter((li) => li.id != list.id);
  }

  onListDeleted(list: List) {
    this.lists = this.lists.filter((li) => li.id != list.id);
  }
}
