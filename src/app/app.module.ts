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
import { registrarPersonaComponent } from './modules/registrar-persona/registrar-persona.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    WelcomeComponent,
    LoginComponent,
    registrarPersonaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    PrimengModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
