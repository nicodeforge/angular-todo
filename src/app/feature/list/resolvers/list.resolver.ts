import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { map, Observable } from "rxjs";
import { List } from "../../../models/list.model";
import { ListService } from "../services/list.service";

@Injectable({
  providedIn: "root",
})
export class ListResolver implements Resolve<List> {
  constructor(private listService: ListService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<List> {
    const listId = <string>route.paramMap.get("id");
    return this.listService.lists.pipe(
      map((lists) => {
        return lists.find((list) => list.id === listId) ?? <List>{};
      })
    );
  }
}
