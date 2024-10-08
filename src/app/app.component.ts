import { Component, OnInit } from '@angular/core';
import { LoadScript } from './scripts/load-script';
// import { WelcomeComponent } from './modules/genericAllAccess/welcome/welcome.component';
import { NavigationEnd, Router } from '@angular/router';
// import { Usuario } from './models/usuario';
import { UsuarioService } from './service/usuario.service';
import { StorageService } from './service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isLogginPresent: boolean = false;
  public isResetPassword: boolean = false;
  public rolNameUser?: any;
  userIsLoggin:any;

  //VALOR PARA CATCH URL
  currentUrl: string = '';

  public foto:any;

  public username:any;

  constructor(private scriptC: LoadScript, private router: Router
    , private usuarioService: UsuarioService,
    private storageServeic: StorageService) {
    scriptC.Cargar(['dashboard']);
  }


  ngOnInit(): void {
    this.rolNameUser = localStorage.getItem('rol');
    this.foto = localStorage.getItem('foto');

    
    try {
      this.username = localStorage.getItem('username')!.toUpperCase();
    } catch (error) {
      console.log(error)
    }
    if(this.rolNameUser){
      this.isLogginPresent = false;
    }else{
      this.isLogginPresent = true;
    }
    console.log("rolF -> " + this.rolNameUser)
    this.obternerDatosUsuarioLoggin(this.rolNameUser);


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        console.log("ruta -> "+ this.currentUrl)
        // if (this.currentUrl.indexOf("recuperar/contrasenia/")) {
        //   this.isResetPassword = true;
        //   console.log("esta true")
        // } else {
        //   this.isResetPassword = false;
        //   console.log("esta false")
        // }
      }
    });




    
  }

  public logOut() {
    this.isLogginPresent = true;
    localStorage.clear();
    this.router.navigate(['/welcome']).then(() => {
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

  activeItem: string = '';

  onItemClick(itemId: string) {
    this.activeItem = itemId;
  }

}

