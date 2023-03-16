import { Component, OnInit } from "@angular/core";
import { AuthService } from "./feature/user/services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "My To-Do list";

  constructor(public auth: AuthService) {}
}
