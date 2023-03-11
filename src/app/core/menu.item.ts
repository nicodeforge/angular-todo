import { HeroIconName } from "ng-heroicon";

export interface MenuItem {
  link: string;
  label: string;

  icon?: HeroIconName;

  submenus?: MenuItem[];
}
