import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SideMenuComponent } from "./components/side-menu/side-menu.component";
import { MenuService } from "./services/menu.service";
import { archive, viewList, tag, HeroIconModule } from "ng-heroicon";

@NgModule({
  declarations: [SideMenuComponent],
  imports: [
    CommonModule,
    RouterLink,
    HeroIconModule.withIcons({
      archive,
      viewList,
      tag,
    }),
    RouterLinkActive,
  ],
  exports: [SideMenuComponent],
  providers: [MenuService],
})
export class CoreModule {}
