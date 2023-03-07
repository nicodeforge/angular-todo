import {Component, OnInit} from '@angular/core';
import {TodoService} from "../../services/todo.service";
import {Item} from "../../models/item.model";

@Component({
  selector: 'app-todo-history',
  templateUrl: './todo-history.component.html',
  styleUrls: ['./todo-history.component.scss']
})
export class TodoHistoryComponent implements OnInit{
  public showHistory:boolean = false;
  public items!:Item[];
  constructor(private todoService:TodoService) {
  }
  ngOnInit() {
    this.todoService.$archive.subscribe((items) => {
      this.items = items;
    });

    this.todoService.fetchArchive();
  }


  onUnarchive(item: Item) {
    this.todoService.unarchive(item);
  }

  onShowHistory() {
    this.showHistory = !this.showHistory;
  }

  onDeleteArchive() {
    this.todoService.deleteArchive();
  }
}
