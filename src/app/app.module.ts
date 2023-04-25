import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './modules/home/home.component';
import { PrimengModule } from './designs/primeng/primeng.module';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { MatriculaComponent } from './modules/matricula/matricula/matricula.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    WelcomeComponent,
    MatriculaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    PrimengModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
