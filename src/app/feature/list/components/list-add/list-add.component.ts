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
import { Subscription, take } from "rxjs";
import { UserService } from "../../../user/services/user.service";

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
  constructor(
    private listService: ListService,
    private userService: UserService
  ) {}

  onAddList() {
    let list = new List(this.listForm.get("listName")?.getRawValue());
    this.userService.user$.pipe(take(1)).subscribe((user) => {
      list.ownedByUserId = user.uid;
      list.sharedWithUserId = [user.uid];
      list.users = { ...list.users, [user.uid]: true };
      this.userService.addList(user, list).then(() => {
        this.listForm.reset();
        this.listAdded.emit(list);
      });
      /*this.subscription = this.listService.save(list).subscribe((list) => {
        console.log("before", user.lists);
        user.lists = { ...user.lists, [list.id]: list };
        console.log("after", user.lists);
        this.userService.update(user);
        //this.listAdded.emit(list);
      });*/
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
