import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { API_URL, LISTS_ENDPOINT } from "../constants";
import { BehaviorSubject, map, Subscription, switchMap } from "rxjs";
import { List } from "../models/list.model";
import { FirebaseNamedResource } from "./list.repository";
import { HttpClient } from "@angular/common/http";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ref, set, get, update, push } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { CreateItem, Item } from "../models/item.model";

@Injectable({
  providedIn: "root",
})
export class UserRepository {
  public user!: User;
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
  constructor(
    private http: HttpClient,
    private afDb: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
      get(ref(this.afDb.database, "users/" + user?.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("user from repo", snapshot.val());
          this.user$.next(snapshot.val());
        } else {
          throw new Error("Cannot fetch user");
        }
      });
    });
  }
  public save(user: User) {
    const db = this.afDb.database;
    //this.updateIndex(user.uid);
    return update(ref(db, "users/" + user.uid), {
      ...user,
    }).then(() => {
      console.log("Repo save user", user);
      this.user$.next(user);
    });
    /*return this.http
      .post<FirebaseNamedResource>(API_URL + "users.json", user)
      .pipe(
        map((userIdentifier: FirebaseNamedResource) => {
          user.id = userIdentifier.name;
          return user as User;
        }),
        switchMap((user) => {
          return this.update(user);
        })
      );*/
  }

  private updateIndex(userId: string) {
    /*const serviceAccount = require("../../environments/the-banette-firebase-adminsdk.conf.json");
    const scopes = ["https://www.googleapis.com/auth/firebase.database"];
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      scopes
    );
    jwtClient.authorize(function (error, tokens) {
      if (error) {
        console.log("Error making request to generate access token:", error);
      } else if (tokens.access_token === null) {
        console.log(
          "Provided service account does not have permission to generate access tokens"
        );
      } else {
        var accessToken = tokens.access_token;
        console.log(accessToken);

        // See the "Using the access token" section below for information
        // on how to use the access token to send authenticated requests to
        // the Realtime Database REST API.
      }
    });*/
    const payload = {
      rules: {
        lists: {
          ".indexOn": `users/${userId}`,
        },
      },
    };

    const db = this.afDb.database;
    this.afAuth.currentUser.then((res) => {
      res?.getIdToken(true).then((idToken) => {
        this.http
          .put(
            `${API_URL}.settings/rules.json?auth=${idToken}&access_token=${idToken}`,
            payload
          )
          .subscribe();
      });
    });
  }

  public update(user: User): void {
    const db = this.afDb.database;
    //this.updateIndex(user.uid);
    update(ref(db, "users/" + user.uid), {
      lists: user.lists ? user.lists : {},
      items: user.items ? user.items : {},
    }).then(() => {
      console.log("Repo update user", user);
      this.user$.next(user);
    });
    //return this.http.put<List>(`${API_URL}users/${user.id}.json`, user);
  }

  public get() {
    return this.user$;
    /*return */
  }

  addList(user: User, list: List): Promise<void> {
    const db = this.afDb.database;
    return update(
      ref(db, "users/" + user.uid + "/lists" + "/" + list.id),
      list
    ).then(() => {
      get(ref(db, "users/" + user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          this.user$.next(snapshot.val());
        }
      });
    });
  }

  addItem(item: CreateItem): Promise<void> {
    const db = this.afDb.database;
    return this.afAuth.currentUser.then((user) => {
      if (user) {
        return push(ref(db, "users/" + user.uid + "/items")).then((dbRef) => {
          update(
            ref(db, "users/" + user.uid + "/items" + "/" + dbRef.key),
            item
          ).then(() => {
            get(ref(db, "users/" + user.uid)).then((snapshot) => {
              if (snapshot.exists()) {
                this.user$.next(snapshot.val());
              }
            });
          });
        });
      } else {
        throw new Error("Cannot determine user");
      }
    });
  }
}
