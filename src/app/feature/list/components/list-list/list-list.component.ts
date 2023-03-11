import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { List } from "../../../../models/list.model";
import { Subscription } from "rxjs";
import { ListService } from "../../services/list.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-list",
  templateUrl: "./list-list.component.html",
  styleUrls: ["./list-list.component.scss"],
})
export class ListListComponent implements OnInit, OnDestroy {
  @Input("show") showLists: boolean = true;
  public lists!: List[];
  public showListAdd: boolean = false;
  private subscription!: Subscription;
  constructor(
    private readonly listService: ListService,
    private router: Router
  ) {}
  public ngOnInit(): void {
    this.subscription = this.listService.findAll().subscribe((lists) => {
      if (lists) {
        this.lists = lists;
      }
    });
  }

  onNavigateToList(listId: string) {
    this.router.navigate(["list", listId]);
  }

  public onToggleListAdd(list?: List): void {
    console.log("Toogle to : ", !this.showListAdd);
    this.showListAdd = !this.showListAdd;
    if (list) {
      this.lists.push(list);
    }
  }

  public onArchiveList(listId: string) {
    //TODO Implement list archive
  }

  onEditList(listId: string) {
    //TODO Implement list edit
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
