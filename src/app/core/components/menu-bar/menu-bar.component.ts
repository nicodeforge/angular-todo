import { Component } from "@angular/core";
import { MenuItem } from "../../menu.item";

@Component({
  selector: "app-menu-bar",
  templateUrl: "./menu-bar.component.html",
  styleUrls: ["./menu-bar.component.scss"],
})
export class MenuBarComponent {
  public menus: MenuItem[] = [
    {
      label: "Manage lists",
      link: "/list",
    },
    {
      label: "Show history",
      link: "/archive",
    },
  ];
}
