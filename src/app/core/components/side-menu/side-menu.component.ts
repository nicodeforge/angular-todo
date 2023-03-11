import { Component, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "../../../models/menu.item";
import { MenuService } from "../../services/menu.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  public menus!: MenuItem[];
  public isDrawerOpen: boolean = false;
  private subscription!: Subscription;
  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.subscription = this.menuService.menus.subscribe((menus) => {
      this.menus = menus;
    });
  }

  onToggleSidebar() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
