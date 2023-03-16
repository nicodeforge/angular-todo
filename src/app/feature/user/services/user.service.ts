import { Injectable } from "@angular/core";
import { User } from "../../../models/user.model";
import { UserRepository } from "../../../repositories/user.repository";
import { BehaviorSubject } from "rxjs";
import { List } from "../../../models/list.model";
import { CreateItem } from "../../../models/item.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(
    this.getUser()
  );
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository.user$.subscribe((user) => {
      console.log("User from service", user);
      this.user$.next(user);
    });
  }

  public getUser(): User {
    const userData = localStorage.getItem("user");

    if (userData) {
      return JSON.parse(userData) as User;
    } else {
      throw new Error("Cannot get user");
    }
  }

  public update(user: User) {
    this.userRepository.update(user);
  }

  addList(user: User, list: List): Promise<void> {
    return this.userRepository.addList(user, list);
  }

  addItem(item: CreateItem): Promise<void> {
    return this.userRepository.addItem(item);
  }
}
