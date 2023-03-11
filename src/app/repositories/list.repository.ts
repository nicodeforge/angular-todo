import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { List } from "../models/list.model";
import { map, Observable, switchMap } from "rxjs";
import { API_URL, LISTS_ENDPOINT } from "../constants";

export class FirebaseNamedResource {
  name!: string;
}

@Injectable({
  providedIn: "root",
})
export class ListRepository {
  constructor(private http: HttpClient) {}

  public findAll(): Observable<List[]> {
    return this.http.get<any>(API_URL + LISTS_ENDPOINT).pipe(
      map((lists) => {
        if (lists) {
          return Object.values(lists);
        } else {
          return [];
        }
      })
    );
  }

  public findById(listId: string): Observable<List> {
    return this.http
      .get<List>(`${API_URL}${LISTS_ENDPOINT}`, {
        params: {
          orderBy: `"id"`,
          equalTo: `"${listId}"`,
          limit: 1,
        },
      })
      .pipe(
        map((listResponse: any) => {
          return Object.values(listResponse)[0] as List;
        })
      );
  }

  public save(list: List): Observable<any> {
    return this.http
      .post<FirebaseNamedResource>(API_URL + LISTS_ENDPOINT, list)
      .pipe(
        map((listIdentifier: FirebaseNamedResource) => {
          list.id = listIdentifier.name;
          return list as List;
        }),
        switchMap((list) => {
          return this.update(list);
        })
      );
  }

  public update(list: List): Observable<any> {
    return this.http.put<List>(`${API_URL}lists/${list.id}.json`, list);
  }
}
