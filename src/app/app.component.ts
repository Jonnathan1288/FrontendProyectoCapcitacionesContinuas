import { Component, OnInit } from '@angular/core';
import { LoadScript } from './scripts/load-script';
import { WelcomeComponent } from './modules/welcome/welcome.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FrontendProyectoCapcitacionesContinuas';
  public isLogginPresent: boolean = true;
  //public isLogginPresent: boolean = false;

  constructor(private scriptC: LoadScript){
    scriptC.Cargar(['dashboard']);
  }
  ngOnInit(): void {

  }
}
