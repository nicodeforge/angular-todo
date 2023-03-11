import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ArchiveRoutingModule } from "./archive-routing.module";
import { ArchiveListComponent } from "./archive-list/archive-list.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [ArchiveListComponent],
  imports: [CommonModule, ArchiveRoutingModule, SharedModule],
})
export class ArchiveModule {}
