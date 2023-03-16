import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { List } from "../models/list.model";
import {
  BehaviorSubject,
  lastValueFrom,
  map,
  Observable,
  switchMap,
  tap,
} from "rxjs";
import { API_URL, LISTS_ENDPOINT } from "../constants";
import { UserService } from "../feature/user/services/user.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import {
  child,
  endAt,
  equalTo,
  get,
  update,
  orderByChild,
  orderByKey,
  query,
  ref,
  startAt,
} from "@angular/fire/database";
import { orderBy } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/compat/auth";

export class FirebaseNamedResource {
  name!: string;
}

@Injectable({
  providedIn: "root",
})
export class ListRepository {
  public lists$: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  public lists: List[] = [];
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private afDb: AngularFireDatabase,

    private afAuth: AngularFireAuth
  ) {}

  public fetchLists(): void {
    const user = this.userService.getUser();
    const userListsRef = query(
      ref(this.afDb.database, "lists"),
      orderByChild(`users/${user.uid}`),
      equalTo(true)
      //endAt(`${user.uid}`)
    );

    get(userListsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const lists = snapshot.val();
        this.lists = Object.values(lists);
        this.lists$.next(this.lists);
      } else {
        console.log("No data available");
      }
    });
    /*let params = {};
    if (user) {
      params = {
        params: {
          orderBy: `"users/${user.uid}"`,
          equalTo: true,
        },
      };
    }
    this.http.get<any>(API_URL + LISTS_ENDPOINT, params).subscribe((lists) => {
      this.lists = Object.values(lists);
      this.lists$.next(this.lists);
    });*/
  }
  public findAll(): Observable<List[]> {
    return this.lists$;
    /*const user = this.userService.getUser();


    let params = {};
    if (user) {
      params = {
        params: {
          orderBy: `"users/${user.uid}"`,
          equalTo: true,
        },
      };
    }
    return this.http.get<any>(API_URL + LISTS_ENDPOINT, params).pipe(
      map((lists) => {
        if (lists) {
          return Object.values(lists);
        } else {
          return [];
        }
      })
    );*/
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
    const db = this.afDb.database;

    return this.http
      .post<FirebaseNamedResource>(API_URL + LISTS_ENDPOINT, list)
      .pipe(
        map((listIdentifier: FirebaseNamedResource) => {
          list.id = listIdentifier.name;
          return list as List;
        }),
        tap((list) => {
          this.lists.push(list);
        }),
        switchMap((list) => {
          return this.update(list);
        })
      );
  }

  public update(list: List): Observable<List> {
    this.lists = this.lists.map((li) => {
      if (li.id === list.id) {
        li = list;
      }
      return li;
    });
    this.lists$.next(this.lists);
    return this.http.put<List>(`${API_URL}lists/${list.id}.json`, list);
  }

  public getListIds(): Observable<string[]> {
    return this.findAll().pipe(
      map((lists) => {
        return lists.map((list) => list.id);
      })
    );
  }

  public delete(list: List): Observable<List> {
    this.lists = this.lists.filter((li) => li.id != list.id);
    this.lists$.next(this.lists);
    return this.http.delete<List>(`${API_URL}lists/${list.id}.json`);
  }
}
