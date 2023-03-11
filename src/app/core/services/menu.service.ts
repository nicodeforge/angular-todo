import { Injectable } from "@angular/core";
import { MenuItem } from "../menu.item";
import { TodoService } from "../../services/todo.service";
import { List } from "../../models/list.model";

@Injectable()
export class MenuService {
  private lists!: List[];
  public menus: MenuItem[] = [
    {
      label: "Manage lists",
      link: "/list",
      icon: "view-list",
      submenus: this.getListsMenu(),
    },
    {
      label: "My archive",
      link: "/archive",
      icon: "archive",
    },
  ];

  constructor(private todoService: TodoService) {}
  public getMenu(): MenuItem[] {
    return this.menus;
  }

  private getListsMenu(): MenuItem[] {
    this.todoService.$lists.subscribe((lists) => (this.lists = lists));
    console.log(this.lists);
    return this.lists.map((list) => {
      return {
        label: list.name,
        link: `/list/${list.id}`,
      };
    });
  }
}
