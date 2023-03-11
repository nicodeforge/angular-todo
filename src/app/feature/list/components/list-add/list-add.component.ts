import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { List } from "../../../../models/list.model";
import { TodoService } from "../../../../services/todo.service";
import { ListService } from "../../services/list.service";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-list-add",
  templateUrl: "./list-add.component.html",
  styleUrls: ["./list-add.component.scss"],
})
export class ListAddComponent implements OnInit {
  @Input() list: List = {} as List;
  @Input() visible!: boolean;
  @Input() layout: string = "horizontal";
  @Input() isEditMode: boolean = false;
  @Output() listAdded: EventEmitter<List> = new EventEmitter<List>();

  public listForm: FormGroup = new FormGroup({
    listName: new FormControl<string>(""),
  });
  constructor(
    private todoService: TodoService,
    private listService: ListService
  ) {}

  ngOnInit() {}

  onAddList() {
    const list = new List(this.listForm.get("listName")?.getRawValue());
    this.listService.save(list).subscribe((list) => {
      this.listAdded.emit(list);
    });
    //this.todoService.addList(this.list);
    //this.listAdded.emit(this.list.id);
    this.listForm.reset();
  }
}
