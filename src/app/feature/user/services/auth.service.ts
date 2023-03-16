import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { User } from "../../../models/user.model";
import * as auth from "firebase/auth";
import { BehaviorSubject } from "rxjs";
import { UserRepository } from "../../../repositories/user.repository";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public userData!: any;
  public user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private userRepository: UserRepository
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.SetUserData(user);
        //localStorage.setItem("user", JSON.stringify(this.userData));
        //JSON.parse(localStorage.getItem("user")!);
        //this.user.next(this.userData);
      } else {
        localStorage.setItem("user", "null");
        JSON.parse(localStorage.getItem("user")!);
        //this.user.next(null);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            console.log("SignIn : got user");
            this.SetUserData(user);
            //this.router.navigate(["list"]);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        this.router.navigate(["list"]);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(["verify-email-address"]);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user")!);
    //return user !== null && user.emailVerified !== false ? true : false;
    return user !== null ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    console.log("AuthLogin");
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    if (user) {
      const userData: User = {
        id: user.uid,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      JSON.parse(localStorage.getItem("user")!);
      this.userData = userData;
      this.userRepository.save(userData);
    }

    //this.userData = userData;
    //this.user.next(userData);

    /*console.log("SHOULD SAVE USER", userData);
    this.router.navigate(["list"]).then((res: any) => {
      console.log("SHOULD REDIRECT USER", res);
    });*/
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("user");
      // this.user.next(null);
      this.router.navigate(["user", "sign-in"]);
    });
  }

  GithubAuth() {
    return this.AuthLogin(new auth.GithubAuthProvider()).then((res: any) => {
      this.router.navigate(["list"]);
    });
  }
}
