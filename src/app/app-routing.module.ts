import { NgModule } from '@angular/core';
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
import { CurricularRegisterComponent } from './modules/curricular-diseño-register/curricular-diseño-register.component';
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { SilaboComponent } from './modules/silabo/silabo.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent },
  {path: 'registrarPersona', component: registrarPersonaComponent},
  {path: 'welcome', component: WelcomeComponent},
  { path: 'home', component: HomeComponent },
  { path: 'cap', component: CapacitadorComponent },
  { path: 'prog', component: ProgramasComponent },
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
