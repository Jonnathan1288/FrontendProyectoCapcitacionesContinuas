import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CapacitadorComponent } from './modules/administradormodule/capacitador/capacitador.component';
import { ProgramasComponent } from './modules/programa/programas/programas.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cap', component: CapacitadorComponent },
  { path: 'prog', component: ProgramasComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
