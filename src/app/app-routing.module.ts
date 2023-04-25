import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MatriculacComponent } from './modules/matriculas/matriculac/matriculac.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'ma', component: MatriculacComponent },

  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
