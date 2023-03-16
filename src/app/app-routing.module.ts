import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./shared/guard/auth.guard";

const routes: Routes = [
  {
    path: "list",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./feature/list/list.module").then((m) => m.ListModule),
  },
  {
    path: "archive",
    canActivate: [AuthGuard],
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
    redirectTo: "/list",
  },
  {
    path: "**",
    //pathMatch: "full",
    redirectTo: "/list",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
