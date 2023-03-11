import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { Item } from "../../../models/item.model";
import { ItemService } from "../../../services/item.service";

@Injectable({
  providedIn: "root",
})
export class ItemResolver implements Resolve<Item[]> {
  constructor(private itemService: ItemService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Item[]> {
    const listId = <string>route.paramMap.get("id");
    if (listId) {
      return this.itemService.findByListId(listId);
    } else {
      return this.itemService.findAll();
    }
  }
}
