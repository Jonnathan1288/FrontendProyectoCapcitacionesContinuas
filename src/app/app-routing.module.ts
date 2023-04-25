import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MatriculComponent } from './modules/matricul/matricul.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'mat', component: MatriculComponent },

  //{ path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
