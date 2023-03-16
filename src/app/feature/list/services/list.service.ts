import { Injectable } from "@angular/core";
import { ListRepository } from "../../../repositories/list.repository";
import { List } from "../../../models/list.model";
import { BehaviorSubject, map, Observable, of } from "rxjs";
import { User } from "../../../models/user.model";
import { UserService } from "../../user/services/user.service";

@Injectable()
export class ListService {
  public lists: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);
  constructor(
    private readonly listRepository: ListRepository,
    private readonly userService: UserService
  ) {
    /*this.listRepository.lists$.subscribe((lists) => {
      this.lists.next(lists);
    });*/
    this.userService.user$
      .pipe(
        map((user: User) => {
          return user?.lists;
        })
      )
      .subscribe((lists) => {
        if (lists) {
          console.log("lists from service", Object.values(lists));
          this.lists.next(Object.values(lists));
        }
      });
  }

  public findAll(): Observable<List[]> {
    return this.listRepository.findAll();
  }

  public findById(listId: string): Observable<List> {
    return this.listRepository.findById(listId);
  }

  public save(list: List): Observable<any> {
    return this.listRepository.save(list);
  }

  update(list: List) {
    return this.listRepository.update(list);
  }

  public addUser(user: User, list: List) {
    if (!this.isUserAlreadyOnList(user, list)) {
      if (list.sharedWithUserId) {
        list.sharedWithUserId.push(user.id);
      } else {
        list.sharedWithUserId = [user.id];
      }
      return this.update(list);
    }
    return of(list);
  }

  private isUserAlreadyOnList(user: User, list: List): boolean {
    const listUsers = list.sharedWithUserId;
    if (!listUsers) {
      return false;
    }

    if (listUsers.findIndex((userId) => userId === user.id) > -1) {
      return true;
    }
    return false;
  }

  getListIds(): Observable<string[]> {
    return this.listRepository.getListIds();
  }

  delete(list: List) {
    return this.listRepository.delete(list);
  }
}
