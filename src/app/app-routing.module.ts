import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MatriculComponent } from './modules/matricul/matricul.component';
import { CardcursoComponent } from './modules/cardcurso/cardcurso.component';
import { InfocursoComponent } from './modules/infocurso/infocurso.component';
import { CurricularRegisterComponent } from './modules/curricular-diseño-register/curricular-diseño-register.component';
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { SilaboComponent } from './modules/silabo/silabo.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'silabo', component: SilaboComponent },
  { path: 'diseño', component: CurricularRegisterComponent },
  { path: 'register/course', component: CourseRegisterComponent },
  { path: 'mat', component: MatriculComponent },
  { path: 'cardcu', component: CardcursoComponent },
  { path: 'info', component: InfocursoComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
