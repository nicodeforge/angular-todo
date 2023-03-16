import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { List } from "../../../../models/list.model";
import { Subscription } from "rxjs";
import { ListService } from "../../services/list.service";
import { Router } from "@angular/router";
import { User } from "../../../../models/user.model";
import { UserService } from "../../../user/services/user.service";
import { ArchiveService } from "../../../archive/services/archive.service";
import { Item } from "../../../../models/item.model";

@Component({
  selector: "app-list-list",
  templateUrl: "./list-list.component.html",
  styleUrls: ["./list-list.component.scss"],
})
export class ListListComponent implements OnInit, OnDestroy {
  @Input("show") showLists: boolean = true;

  public user!: User;
  public lists: List[] = [];

  public activeLists: List[] = [];
  public archivedLists: List[] = [];
  public showListAdd: boolean = false;
  private subscription!: Subscription;
  constructor(
    private readonly listService: ListService,
    private router: Router,
    private userService: UserService,
    private archiveService: ArchiveService
  ) {}
  public ngOnInit(): void {
    /*this.subscription = this.listService.findAll().subscribe((lists) => {
      if (lists) {
        this.lists = lists;
        this.archivedLists = lists.filter((list) => list.isArchived);
        this.activeLists = lists.filter((list) => !list.isArchived);
      }
    });*/

    this.subscription = this.listService.lists.subscribe((lists) => {
      if (lists) {
        this.lists = lists;
        this.archivedLists = lists.filter((list) => list.isArchived);
        this.activeLists = lists.filter((list) => !list.isArchived);
      }
    });

    this.user = this.userService.getUser();
  }

  onNavigateToList(listId: string) {
    this.router.navigate(["list", listId]);
  }

  public onToggleListAdd(list?: List): void {
    console.log("Toogle to : ", !this.showListAdd);
    this.showListAdd = !this.showListAdd;
    /*if (list) {
      this.lists.push(list);
      this.activeLists.push(list);
    }*/
  }

  public onArchiveList(listId: string) {
    console.log("Archive started");
    const list = this.lists.find((li) => li.id === listId);
    if (list) {
      this.archiveService.archiveList(list).subscribe((list) => {
        this.activeLists = this.activeLists.filter((li) => li.id != list.id);
        this.archivedLists.push(list);
        console.log("Archive success");
      });
    }
  }

  onEditList(listId: string) {
    //TODO Implement list edit
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
