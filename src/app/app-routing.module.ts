import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CurricularRegisterComponent } from './modules/curricular-diseño-register/curricular-diseño-register.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'diseño', component: CurricularRegisterComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
