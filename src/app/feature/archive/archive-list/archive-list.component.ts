import { Component, OnDestroy, OnInit } from "@angular/core";
import { Item } from "../../../models/item.model";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ArchiveService } from "../services/archive.service";
import { ItemService } from "../../../services/item.service";

@Component({
  selector: "app-archive-list",
  templateUrl: "./archive-list.component.html",
  styleUrls: ["./archive-list.component.scss"],
})
export class ArchiveListComponent implements OnInit, OnDestroy {
  public items!: Item[];
  private sub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private archiveService: ArchiveService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.sub = this.route.data.subscribe((data) => {
      this.items = data["items"].filter((item: Item) => item.isArchived);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onItemUnarchived(item: Item): void {
    this.archiveService.unarchiveItem(item);
    this.items = this.items.filter((it) => it.id != item.id);
  }

  public onItemDeleted(item: Item): void {
    this.itemService.delete(item);
    this.items = this.items.filter((it) => it.id != item.id);
  }
}
