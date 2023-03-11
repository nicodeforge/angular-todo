import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuBarComponent } from "./components/menu-bar/menu-bar.component";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SideMenuComponent } from "./components/side-menu/side-menu.component";
import { MenuService } from "./services/menu.service";
import { archive, viewList, HeroIconModule } from "ng-heroicon";

@NgModule({
  declarations: [MenuBarComponent, SideMenuComponent],
  imports: [
    CommonModule,
    RouterLink,
    HeroIconModule.withIcons({
      archive,
      viewList,
    }),
    RouterLinkActive,
  ],
  exports: [MenuBarComponent, SideMenuComponent],
  providers: [MenuService],
})
export class CoreModule {}
