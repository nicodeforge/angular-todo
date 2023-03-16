import { Component, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "../../../models/menu.item";
import { MenuService } from "../../services/menu.service";
import { Subscription } from "rxjs";
import { AuthService } from "../../../feature/user/services/auth.service";
import { HeroIconName } from "ng-heroicon";
import { UserService } from "../../../feature/user/services/user.service";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  public menus!: MenuItem[];

  public userMenu!: MenuItem;
  public isDrawerOpen: boolean = false;
  private subscription!: Subscription;
  constructor(
    private menuService: MenuService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscription = this.menuService.menus.subscribe((menus) => {
      this.menus = menus;
    });

    const user = this.userService.getUser();

    if (user) {
      this.userMenu = {
        label: user.displayName,
        link: "/user/profile",
        icon: user.photoURL as HeroIconName,
      };
    }
  }

  onToggleSidebar() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSignOut() {
    this.auth.SignOut();
  }
}
