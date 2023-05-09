import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { OauthService } from 'src/app/service/oauth.service';
import { ToastrService } from 'ngx-toastr';
import { Rol } from 'src/app/models/rol';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public usuario = new Usuario();
  constructor(
    private router: Router,
    private oauthService: OauthService,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {}

  showSpinner: any;

  public roles: Rol[] = [];

  public rolLocalStorage?: any;
  public login() {
    if (this.usuario.username && this.usuario.password) {
      this.oauthService
        .login(this.usuario.username ?? '', this.usuario.password ?? '')
        .subscribe((data) => {
          if (data != null) {
            this.roles = data.roles!;

            localStorage.removeItem('id_username');
            localStorage.removeItem('id_persona');
            localStorage.removeItem('foto');
            localStorage.removeItem('rol');
            localStorage.removeItem('username');

            //Almacenar en el storage
            localStorage.setItem('id_username', String(data.idUsuario));
            localStorage.setItem('id_persona', String(data.persona?.idPersona));
            localStorage.setItem('foto', String(data.fotoPerfil));

            localStorage.setItem('username', String(data.username));

            if (data.roles?.length! > 1) {
              this.modalView();
            } else {
              this.toastrService.success('Bienvenido', 'Registro Exitoso', {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
              });

              for (let rol of data.roles!) {
                localStorage.setItem('rol', String(rol.nombreRol));
              }

              setTimeout(() => {
                this.showSpinner = false;
                window.location.reload();
                location.replace('/home');
              }, 1500);
            }
          } else {
            this.toastrService.error(
              'Credenciales Incorrectas',
              'Revise sus credenciales',
              {
                timeOut: 3000,
              }
            );
          }
        });
    } else {
      this.toastrService.warning(
        'Uno o más campos vacios',
        'Verifique los Campos de texto',
        {
          timeOut: 1000,
        }
      );
    }
  }

  //paso a la parte de registro de persona si no tengo cuenta en el portal.

  public createAccount() {
    setTimeout(() => {
      this.router.navigate(['/registrarPersona']);
    }, 50);
  }

  public visiblePeriodoMensual?: boolean = false;
  public modalView() {
    this.visiblePeriodoMensual = true;
  }

  public guardarRolStorage(nombre: string) {
    this.showSpinner = true;

    this.toastrService.success('Bienvenido', 'Registro Exitoso', {
      timeOut: 1500,
      progressBar: true,
      progressAnimation: 'increasing',
    });

    localStorage.setItem('rol', String(nombre));
    setTimeout(() => {
      this.showSpinner = false;
      window.location.reload();
      location.replace('/home');
    }, 1500);
  }
}
