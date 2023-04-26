import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { registrarPersonaComponent } from './modules/registrar-persona/registrar-persona.component';
import { WelcomeComponent } from './modules/welcome/welcome.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  //{ path: '**', pathMatch: 'full', redirectTo: 'welcome' },
  {path: 'login', component:LoginComponent },
  {path: 'registrarPersona', component: registrarPersonaComponent},
  {path: 'welcome', component: WelcomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
