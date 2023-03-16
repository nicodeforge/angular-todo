import { Component } from "@angular/core";
import { List } from "../../../../models/list.model";
import { ListService } from "../../services/list.service";
import { UserService } from "../../../user/services/user.service";
import { User } from "../../../../models/user.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-list-accept-invite",
  templateUrl: "./list-accept-invite.component.html",
  styleUrls: ["./list-accept-invite.component.scss"],
})
export class ListAcceptInviteComponent {
  public list!: List;
  public user!: User;

  constructor(
    private listService: ListService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data) => {
      this.list = data["list"];
    });

    this.user = this.userService.getUser();
  }

  onAcceptInvite() {
    this.listService.addUser(this.user, this.list).subscribe((res) => {
      this.router.navigate(["list"]);
    });
  }

  onDeclineInvite() {
    this.router.navigate(["list"]);
  }
}
