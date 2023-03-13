import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "list",
    loadChildren: () =>
      import("./feature/list/list.module").then((m) => m.ListModule),
  },
  {
    path: "archive",
    loadChildren: () =>
      import("./feature/archive/archive.module").then((m) => m.ArchiveModule),
  },
  {
    path: "user",
    loadChildren: () =>
      import("./feature/user/user.module").then((m) => m.UserModule),
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
