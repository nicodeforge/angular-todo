import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Item } from "../models/item.model";
import { lastValueFrom, map, Observable, switchMap } from "rxjs";
import { API_URL, ARCHIVE_ENDPOINT } from "../constants";
import { FirebaseNamedResource } from "./list.repository";

@Injectable({
  providedIn: "root",
})
export class ArchiveRepository {
  constructor(private http: HttpClient) {}

  public async findAll(): Promise<Item[]> {
    return await lastValueFrom(
      this.http.get<Item[]>(API_URL + ARCHIVE_ENDPOINT)
    );
  }

  public save(newArchive: Item): Observable<any> {
    return this.http
      .post<FirebaseNamedResource>(API_URL + ARCHIVE_ENDPOINT, newArchive)
      .pipe(
        map((itemIdentifier: FirebaseNamedResource) => {
          const archive: Item = { ...newArchive, id: itemIdentifier.name };
          return archive;
        }),
        switchMap((archive: Item) => {
          return this.update(archive);
        })
      );
  }

  public update(archive: Item): Observable<any> {
    return this.http.put<Item>(
      `${API_URL}archives/${archive.id}.json`,
      archive
    );
  }
}
