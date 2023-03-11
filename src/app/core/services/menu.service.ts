import { Injectable } from "@angular/core";
import { MenuItem } from "../../models/menu.item";
import { List } from "../../models/list.model";
import { ListService } from "../../feature/list/services/list.service";
import { BehaviorSubject } from "rxjs";
import { HeroIconName } from "ng-heroicon";

@Injectable()
export class MenuService {
  public menus: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(
    []
  );

  constructor(private listService: ListService) {
    this.listService.findAll().subscribe((lists) => {
      const menus = [
        {
          label: "Manage lists",
          link: "/list",
          icon: <HeroIconName>"view-list",
          submenus: this.getListsMenu(lists),
        },
        {
          label: "My archive",
          link: "/archive",
          icon: <HeroIconName>"archive",
        },
      ];
      this.menus.next(menus);
    });
  }

  private getListsMenu(lists: List[]): MenuItem[] {
    return lists.map((list) => {
      return {
        label: list.name,
        link: `/list/${list.id}`,
        icon: <HeroIconName>"tag",
      };
    });
  }
}
