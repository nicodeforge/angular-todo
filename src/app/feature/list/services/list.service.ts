import { Injectable } from "@angular/core";
import { ListRepository } from "../../../repositories/list.repository";
import { List } from "../../../models/list.model";
import { Observable } from "rxjs";

@Injectable()
export class ListService {
  constructor(private readonly listRepository: ListRepository) {}

  public findAll(): Observable<List[]> {
    return this.listRepository.findAll();
  }

  public findById(listId: string): Observable<List> {
    return this.listRepository.findById(listId);
  }

  public save(list: List): Observable<any> {
    return this.listRepository.save(list);
  }
}
