import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { SilaboComponent } from './modules/silabo/silabo.component';
import { CurricularDiseñoComponent } from './modules/curricular-diseño-register/curricular-diseño.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'silabo', component: SilaboComponent },
  { path: 'diseño', component: CurricularDiseñoComponent },
  { path: 'register/course', component: CourseRegisterComponent },

  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
