import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";
import { ProfileComponent } from "./profile/profile.component";
const routes: Route[] = [
  {
    path: "sign-in",
    component: SignInComponent,
  },
  {
    path: "sign-up",
    component: SignUpComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "verify-email-address",
    component: VerifyEmailComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
