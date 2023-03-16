import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { List } from "../models/list.model";
import { filter, map, Observable, switchMap } from "rxjs";
import { API_URL, ITEMS_ENDPOINT } from "../constants";
import { FirebaseNamedResource } from "./list.repository";
import { CreateItem, Item } from "../models/item.model";
import { UserService } from "../feature/user/services/user.service";
import { User } from "../models/user.model";
import { ListService } from "../feature/list/services/list.service";

@Injectable({
  providedIn: "root",
})
export class ItemRepository {
  constructor(
    private http: HttpClient,
    private listService: ListService,
    private userService: UserService
  ) {}

  public findAll(): Observable<Item[]> {
    const user = this.userService.getUser();
    let params = {};
    if (user) {
      params = {
        params: {
          orderBy: `"ownedByUserId"`,
          equalTo: `"${user.uid}"`,
        },
      };
    }
    //TODO : Find all method should only returns items part of a list attributed to the loggedIn user
    return this.http.get<any>(API_URL + ITEMS_ENDPOINT, params).pipe(
      map((items) => {
        if (items) {
          return Object.values(items);
        } else {
          return [];
        }
      })
    );
  }

  public save(newItem: CreateItem): Observable<any> {
    return this.http
      .post<FirebaseNamedResource>(API_URL + ITEMS_ENDPOINT, newItem)
      .pipe(
        map((itemIdentifier: FirebaseNamedResource) => {
          const item: Item = {
            ...newItem,
            id: itemIdentifier.name,
            ownedByUserId: this.userService.getUser().uid,
          };
          return item;
        }),
        switchMap((item: Item) => {
          return this.update(item);
        })
      );
  }

  public update(item: Item): Observable<any> {
    return this.http.put<List>(`${API_URL}items/${item.id}.json`, item);
  }

  public findById(itemId: string): Observable<Item> {
    return this.http
      .get<Item>(`${API_URL}${ITEMS_ENDPOINT}`, {
        params: {
          orderBy: `"id"`,
          equalTo: `"${itemId}"`,
          limit: 1,
        },
      })
      .pipe(
        map((itemResponse: any) => {
          return Object.values(itemResponse)[0] as Item;
        })
      );
  }

  public findByListId(listId: string): Observable<Item[]> {
    return this.http
      .get<any>(`${API_URL}${ITEMS_ENDPOINT}`, {
        params: {
          orderBy: `"listId"`,
          equalTo: `"${listId}"`,
        },
      })
      .pipe(
        map((itemResponse: any) => {
          if (itemResponse) {
            return Object.values(itemResponse) as Item[];
          } else {
            return [];
          }
        })
      );
  }

  public delete(item: Item) {
    return this.http.delete(`${API_URL}items/${item.id}.json`);
  }
}
