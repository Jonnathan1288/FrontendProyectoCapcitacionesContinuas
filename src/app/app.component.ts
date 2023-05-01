import { Component, OnInit } from '@angular/core';
import { LoadScript } from './scripts/load-script';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { Router } from '@angular/router';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FrontendProyectoCapcitacionesContinuas';
  public isLogginPresent: boolean = true;
  userIsLoggin:any;
  constructor(private scriptC: LoadScript, private router: Router
    , private usuarioService: UsuarioService,){
    scriptC.Cargar(['dashboard']);
  }

  public idUsuarioIsLoggin: any;

  ngOnInit(): void {
    this.userIsLoggin = localStorage.getItem('rol');
    if(this.userIsLoggin){
      this.isLogginPresent = false;
    }else{
      this.isLogginPresent = true;
      this.idUsuarioIsLoggin = localStorage.getItem('id_username');
      this.obternerDatosUsuarioLoggin(this.idUsuarioIsLoggin);
    }
  }

  public logOut(){
    this.isLogginPresent = true;
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }



usuario: Usuario = new Usuario();

public obternerDatosUsuarioLoggin(idUsuarioLogin:number):void{
  this.usuarioService.getUsuarioById(idUsuarioLogin).subscribe(
    data =>{
      this.usuario = data;
    }
  )
}
}
