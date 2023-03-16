import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
  public userForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.router.navigate(["list"]);
    }
  }

  onSubmit() {
    console.log(this.userForm.getRawValue());
  }

  public async onGoogleAuth() {
    this.auth
      .GoogleAuth()
      .then((res: any) => {
        console.log("From component resolved to ", res);
      })
      .finally(() => {
        console.log("From component fulfilled");
        this.router
          .navigate(["list"])
          .then((res: any) => {
            console.log("Router then : ", res);
          })
          .catch((e) => {
            console.warn("Router error : ", e);
          });
      });
  }

  onGithubAuth() {
    this.auth.GithubAuth().then((res: any) => {
      this.router.navigate(["list"]);
    });
  }
}
