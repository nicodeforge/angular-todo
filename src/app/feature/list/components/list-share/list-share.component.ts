import { Component, Input, OnInit } from "@angular/core";
import { List } from "../../../../models/list.model";
import { FormControl, FormGroup } from "@angular/forms";
import { ListService } from "../../services/list.service";

@Component({
  selector: "app-list-share",
  templateUrl: "./list-share.component.html",
  styleUrls: ["./list-share.component.scss"],
})
export class ListShareComponent implements OnInit {
  @Input() list!: List;
  public showForm: boolean = false;
  public shareListForm: FormGroup = new FormGroup({
    userId: new FormControl(""),
  });
  public baseUrl: string = window.location.host;
  public linkCopied: boolean = false;

  constructor(private listService: ListService) {}

  ngOnInit() {}

  onShareList() {
    const userId = this.shareListForm.get("userId")?.getRawValue();
    console.log("Sharing list ", this.list.id, "with user id ", userId);
    if (this.list.sharedWithUserId) {
      this.list.sharedWithUserId.push(userId);
    } else {
      this.list["sharedWithUserId"] = [userId];
    }

    this.listService.update(this.list).subscribe((list) => {
      this.shareListForm.reset();
      this.onToogleForm();
      console.log("Successfully added user to list", list);
    });
  }

  onToogleForm() {
    this.showForm = !this.showForm;
    this.linkCopied = false;
  }

  onCopyInviteLink(e: any) {
    this.linkCopied = true;
    console.log(e);
  }
}
