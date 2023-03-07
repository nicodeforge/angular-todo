import {Component, OnInit} from '@angular/core';
import {Item, ItemStatusEnum} from "../../models/item.model";
import {TodoService} from "../../services/todo.service";

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.scss'],
})
export class TodoAddComponent implements OnInit{

  public item!:Item;
  public isEditMode: boolean = false;
  constructor(private todoService:TodoService) {
  }

  ngOnInit() {
    this.todoService.item$.subscribe((item) => {
      this.item = item;
      if(null != item.id){
        this.isEditMode = true;
      }

    });


  }

  public onAddItem():void{
    if(this.isEditMode){
      this.todoService.updateItem(this.item);
    }else{
      this.todoService.addItem(this.item);
    }
    this.resetForm();

  }

  private resetForm():void{
    this.item = {
      id: "dummyId",
      name: null,
      dueAt:null,
      status:ItemStatusEnum.TODO
    }
    this.isEditMode = false;
  }
}
