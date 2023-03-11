import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { List } from "../../../../models/list.model";
import { ListService } from "../../services/list.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-list-add",
  templateUrl: "./list-add.component.html",
  styleUrls: ["./list-add.component.scss"],
})
export class ListAddComponent implements OnDestroy {
  @Input() list: List = {} as List;
  @Input() visible!: boolean;
  @Input() layout: string = "horizontal";
  @Input() isEditMode: boolean = false;
  @Output() listAdded: EventEmitter<List> = new EventEmitter<List>();

  public listForm: FormGroup = new FormGroup({
    listName: new FormControl<string>(""),
  });

  private subscription!: Subscription;
  constructor(private listService: ListService) {}

  onAddList() {
    const list = new List(this.listForm.get("listName")?.getRawValue());
    this.subscription = this.listService.save(list).subscribe((list) => {
      this.listAdded.emit(list);
    });
    this.listForm.reset();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
