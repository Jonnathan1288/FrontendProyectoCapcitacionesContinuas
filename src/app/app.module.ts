import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { CommonModule } from '@angular/common';
import { SilaboComponent } from './modules/silabo/silabo.component';
import { RouterModule } from '@angular/router';
import { FormRecord, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatriculComponent } from './modules/matricul/matricul.component';
import { HttpClientModule } from '@angular/common/http';
import { CardcursoComponent } from './modules/cardcurso/cardcurso.component';
import { InfocursoComponent } from './modules/infocurso/infocurso.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    WelcomeComponent,
  LoginComponent,
    registrarPersonaComponent,
    CourseRegisterComponent,
  SilaboComponent,
    MatriculComponent,
    CardcursoComponent,
    InfocursoComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    PrimengModule,
    HttpClientModule
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
