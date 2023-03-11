import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ArchiveListComponent } from "./archive-list/archive-list.component";
import { ItemResolver } from "../list/resolvers/item.resolver";

const routes: Routes = [
  {
    path: "",
    component: ArchiveListComponent,
    resolve: {
      items: ItemResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchiveRoutingModule {}
