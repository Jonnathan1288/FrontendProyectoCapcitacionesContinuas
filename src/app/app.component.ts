import { Component, OnInit } from '@angular/core';
import { LoadScript } from './scripts/load-script';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FrontendProyectoCapcitacionesContinuas';
  public isLogginPresent: boolean = true;
  userIsLoggin:any;
  constructor(private scriptC: LoadScript, private router: Router){
    scriptC.Cargar(['dashboard']);
  }
  ngOnInit(): void {
    this.userIsLoggin = localStorage.getItem('rol');
    if(this.userIsLoggin){
      this.isLogginPresent = false;
    }else{
      this.isLogginPresent = true;
    }
  }

  public logOut(){
    this.isLogginPresent = true;
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
