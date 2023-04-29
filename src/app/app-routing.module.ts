import { NgModule } from '@angular/core';
import { AuthGaurdGuard } from './auth-gaurd.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CapacitadorComponent } from './modules/administradormodule/capacitador/capacitador.component';
import { ProgramasComponent } from './modules/programa/programas/programas.component';
import { LoginComponent } from './modules/login/login.component';
import { registrarPersonaComponent } from './modules/registrar-persona/registrar-persona.component';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { MatriculComponent } from './modules/matricul/matricul.component';
import { CardcursoComponent } from './modules/cardcurso/cardcurso.component';
import { InfocursoComponent } from './modules/infocurso/infocurso.component';
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { SilaboComponent } from './modules/silabo/silabo.component';
import { CurricularDiseñoComponent } from './modules/curricular-diseño-register/curricular-diseño.component';
import { ListCourseComponent } from './modules/moduleCourse/list-course/list-course.component';
import { RegistroNecesidadComponent } from './modules/moduleCourse/registro-necesidad/registro-necesidad.component';
import { ViewInscritosCursoComponent } from './modules/view-inscritos-curso/view-inscritos-curso.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent },
  {path: 'registrarPersona', component: registrarPersonaComponent},
  {path: 'welcome', component: WelcomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'cap', component: CapacitadorComponent },
  { path: 'prog', component: ProgramasComponent },
  { path: 'silabo', component: SilaboComponent },
  { path: 'diseño', component: CurricularDiseñoComponent },
  // { path: 'register/course', component: CourseRegisterComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['Administrador'] }},
  { path: 'register/course', component: CourseRegisterComponent},
  { path: 'verInscritos/course/:id', component: ViewInscritosCursoComponent},
  { path: 'register/course/:id', component: CourseRegisterComponent },
  { path: 'list/course', component: ListCourseComponent },
  { path: 'register/necesidad', component: RegistroNecesidadComponent },
  { path: 'register/necesidad/:id', component: RegistroNecesidadComponent },
  { path: 'mat', component: MatriculComponent },
  { path: 'cardcu', component: CardcursoComponent },
  { path: 'mat/:id', component: MatriculComponent },
  { path: 'cardcu/detalle/:id', component: InfocursoComponent },
  { path: 'info', component: InfocursoComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
