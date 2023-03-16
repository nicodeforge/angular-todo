import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";
import { UserRoutingModule } from "./user-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule],
})
export class UserModule {}
