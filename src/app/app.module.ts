import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "./shared/shared.module";
import { ListModule } from "./feature/list/list.module";
import { CoreModule } from "./core/core.module";
import { HeroIconModule, menu } from "ng-heroicon";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { environment } from "../environments/environment";
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideDatabase, getDatabase } from "@angular/fire/database";
import { HttpClientModule } from "@angular/common/http";
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from "@angular/fire/compat/auth";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ListModule,
    SharedModule,
    CoreModule,
    HttpClientModule,
    HeroIconModule.forRoot(
      {
        menu,
      },
      {
        defaultHostDisplay: "inlineBlock", // default 'none'
        attachDefaultDimensionsIfNoneFound: true, // default 'false'
      }
    ),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,

    //provideFirebaseApp(() => initializeApp(environment.firebase)),
    //provideAuth(() => getAuth(initializeApp(environment.firebase))),
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
