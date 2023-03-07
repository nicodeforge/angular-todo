import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from "../../models/item.model";
import {TodoService} from "../../services/todo.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy{
  public items!: Item[];
  public subscription!:Subscription;
  constructor(private todoService:TodoService) {
  }
  ngOnInit() {
    this.subscription = this.todoService.$items.subscribe((items:Item[]) => {
      this.items = items.sort((a,b) => {
        if(a.dueAt && b.dueAt){
          return a?.dueAt < b?.dueAt ? -1 : 1
        }else{
          return a.id < b.id ? -1 : 1
        }

      } );
    });

    this.todoService.fetchItemsLocally();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onArchiveItem(item: Item) {
    this.todoService.archiveItem(item);
    this.todoService.delete(item)

  }

  onEditItem(item: Item) {
    this.todoService.edit(item);
  }

  onClearList() {
    this.todoService.archiveAll();
  }

  onItemDone(item: Item) {
    this.todoService.markItemDone(item);
  }

  onClearDone() {
    this.todoService.archiveItemsDone();
  }

}
