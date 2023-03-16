import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { map, Observable, of } from "rxjs";
import { Item } from "../../../models/item.model";
import { ItemService } from "../../../services/item.service";
import { UserService } from "../../user/services/user.service";
import { ListService } from "../services/list.service";
import { List } from "../../../models/list.model";

@Injectable({
  providedIn: "root",
})
export class ItemResolver implements Resolve<Item[]> {
  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private listService: ListService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Item[]> {
    /*const listId = <string>route.paramMap.get("id");
    const userId = this.userService.getUser().uid;
    console.log("Items resolver got hit");
    this.listService.getListIds().subscribe((listIds) => {
      listIds.forEach((listId) => {
        return this.itemService.findByListId(listId);
        //return console.log("list : ", listId);
      });
    });

    if (listId) {
      return this.itemService.findByListId(listId);
    } else {
      return this.itemService.findAll();
    }*/
    const listId = <string>route.paramMap.get("id");
    return this.itemService.items.pipe(
      map((items) => {
        if (listId) {
          console.log(
            "Resolved items with list",
            items.filter((item) => item.listId === listId) ?? <Item[]>[]
          );
          return items.filter((item) => item.listId === listId) ?? <Item[]>[];
        } else {
          console.log("Resolved items without list", items);
          return items;
        }
      })
    );
  }
}
