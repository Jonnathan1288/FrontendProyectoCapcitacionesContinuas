import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './modules/home/home.component';
import { PrimengModule } from './designs/primeng/primeng.module';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { LoginComponent } from './modules/login/login.component';
import { RegistrarPersonaComponent } from './modules/registrar-persona/registrar-persona.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    WelcomeComponent,
    LoginComponent,
    RegistrarPersonaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    PrimengModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
