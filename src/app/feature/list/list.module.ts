import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListListComponent } from "./components/list-list/list-list.component";
import { ListAddComponent } from "./components/list-add/list-add.component";
import { ListRoutingModule } from "./list-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListService } from "./services/list.service";
import { ListDetailComponent } from "./components/list-detail/list-detail.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [ListListComponent, ListAddComponent, ListDetailComponent],
  imports: [
    CommonModule,
    ListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [ListAddComponent, ListListComponent],
  providers: [ListService],
})
export class ListModule {}
