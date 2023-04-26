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
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { CommonModule } from '@angular/common';
import { SilaboComponent } from './modules/silabo/silabo.component';
import {CurricularDiseñoComponent  } from './modules/curricular-diseño-register/curricular-diseño.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    WelcomeComponent,
    CourseRegisterComponent,
    CurricularDiseñoComponent,
    SilaboComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    PrimengModule,
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
