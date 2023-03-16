import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { ListListComponent } from "./components/list-list/list-list.component";
import { ListDetailComponent } from "./components/list-detail/list-detail.component";
import { ListResolver } from "./resolvers/list.resolver";
import { ItemResolver } from "./resolvers/item.resolver";
import { ListAcceptInviteComponent } from "./components/list-accept-invite/list-accept-invite.component";
const routes: Route[] = [
  {
    path: ":id/invite",
    component: ListAcceptInviteComponent,
    resolve: {
      list: ListResolver,
    },
  },
  {
    path: ":id",
    component: ListDetailComponent,
    resolve: {
      list: ListResolver,
      items: ItemResolver,
    },
  },
  {
    path: "",
    component: ListListComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRoutingModule {}
