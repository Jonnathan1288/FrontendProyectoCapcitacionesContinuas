import { Component, OnInit } from '@angular/core';
import { LoadScript } from './scripts/load-script';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { Router } from '@angular/router';
import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';
import { StorageService } from './service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(private scriptC: LoadScript, private router: Router
    , private usuarioService: UsuarioService,
    private storageServeic: StorageService) {
    scriptC.Cargar(['dashboard']);
  }

  public isLogginPresent: boolean = false;
  public rolNameUser?: any;
  userIsLoggin:any;

  ngOnInit(): void {
    this.rolNameUser = localStorage.getItem('rol');
    if(this.rolNameUser){
      this.isLogginPresent = false;
    }else{
      this.isLogginPresent = true;
    }
    console.log("rolF -> " + this.rolNameUser)
    this.obternerDatosUsuarioLoggin(this.rolNameUser);
  }

  public logOut() {
    this.isLogginPresent = true;
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isAdministrador: boolean = false;
  isCapacitador: boolean = false;
  isParticipante: boolean = false;

  public obternerDatosUsuarioLoggin(nombreRol:any): void {
    switch (nombreRol) {
      case 'Administrador':
        this.isAdministrador = true;
        this.isCapacitador = false;
        this.isParticipante = false;
        break;
      case 'DocenteCapacitador':
        this.isAdministrador = false;
        this.isCapacitador = true;
        this.isParticipante = false;
        break;
      case 'Participante':
        this.isAdministrador = false;
        this.isCapacitador = false;
        this.isParticipante = true;
        break;
      default:
        // alert('ROL DESCONOCIDO');
        break;
    };
  }

}

