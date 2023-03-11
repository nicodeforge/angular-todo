import { Component, OnInit } from "@angular/core";
import { MenuItem } from "../../menu.item";
import { MenuService } from "../../services/menu.service";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
})
export class SideMenuComponent implements OnInit {
  public menus!: MenuItem[];
  public isDrawerOpen: boolean = false;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menus = this.menuService.getMenu();
  }

  onToggleSidebar() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
