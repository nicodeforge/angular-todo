import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CreateItem, Item, ItemStatusEnum } from "../../../models/item.model";
import { TodoService } from "../../../services/todo.service";
import { List } from "../../../models/list.model";
import { Subject } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { ItemService } from "../../../services/item.service";

@Component({
  selector: "app-todo-add",
  templateUrl: "./todo-add.component.html",
  styleUrls: ["./todo-add.component.scss"],
})
export class TodoAddComponent implements OnInit {
  public isEditMode: boolean = false;
  public lists!: List[];
  public showListAddForm: boolean = false;

  @Input() itemEditted: Subject<Item> = new Subject<Item>();
  public itemForm: FormGroup = new FormGroup({
    name: new FormControl(),
    dueAt: new FormControl(),
    listId: new FormControl(),
  });
  @Input() showListSelect: boolean = true;
  @Input() list!: List;
  @Output() itemAdded: EventEmitter<Item> = new EventEmitter<Item>();
  @Output("itemEditted") itemUpdated: EventEmitter<Item> =
    new EventEmitter<Item>();
  private item!: Item;
  constructor(
    private todoService: TodoService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    console.log(this.list.id);
    this.itemForm.get("listId")?.setValue(this.list.id);

    this.itemEditted.subscribe((item) => {
      if (item.name) {
        this.item = item;
        this.itemForm.get("name")?.setValue(item.name);
        this.itemForm
          .get("dueAt")
          ?.setValue(item?.dueAt ? new Date(item.dueAt) : null);
        this.itemForm.get("listId")?.setValue(item?.listId);
        this.isEditMode = true;
      }
    });
    /*this.subscription = this.todoService.item$.subscribe((item) => {
      this.item = item;
      if (null != item.name) {
        this.isEditMode = true;
        console.log(item);
      }
    });

    this.todoService.$lists.subscribe((lists) => {
      this.lists = lists;
    });*/
  }

  public onAddItem2(): void {
    if (this.isEditMode) {
      this.handleUpdateItem();
    } else {
      this.handleAddItem();
    }
  }

  private handleAddItem(): void {
    this.itemForm.get("listId")?.setValue(this.list.id);
    const newItem: CreateItem = {
      name: this.itemForm.get("name")?.getRawValue(),
      listId: this.list.id,
      dueAt: this.itemForm.get("dueAt")?.getRawValue()
        ? new Date(this.itemForm.get("dueAt")?.getRawValue())
        : null,
      createdAt: new Date(Date.now()),
      isArchived: false,
      status:
        this.itemForm.get("dueAt")?.getRawValue() === null
          ? ItemStatusEnum.TODO
          : new Date(Date.now()) <
            new Date(this.itemForm.get("dueAt")?.getRawValue())
          ? ItemStatusEnum.TODO
          : ItemStatusEnum.LATE,
    };

    this.itemService.save(newItem).subscribe((item: Item) => {
      this.itemAdded.emit(item);
      this.itemForm.reset();
    });
  }
  private handleUpdateItem(): void {
    const updatedItem = {
      ...this.item,
      name: this.itemForm.get("name")?.getRawValue(),
      dueAt: this.itemForm.get("dueAt")?.getRawValue()
        ? new Date(this.itemForm.get("dueAt")?.getRawValue())
        : null,
    };
    this.itemService.update(updatedItem).subscribe((item: Item) => {
      this.itemUpdated.emit(item);
      this.itemForm.reset();
    });
  }

  /*public onAddItem(): void {
    if (this.list.id) {
      this.item.listId = this.list.id;
    }
    console.log("ADD ITEM", this.item);
    if (this.isEditMode) {
      this.todoService.updateItem(this.item);
    } else {
      this.todoService.addItem(this.item);
    }
    this.resetForm();
  }*/

  /*private resetForm(): void {
    this.item = new Item();
    this.isEditMode = false;
  }*/

  onToggleListForm() {
    this.showListAddForm = !this.showListAddForm;
  }

  /*onSelectListOption($event: string) {
    this.onToggleListForm();
    this.item.listId = $event;
    console.log("Selected list : ", $event);
    console.log("Item", this.item);
  }*/
}
