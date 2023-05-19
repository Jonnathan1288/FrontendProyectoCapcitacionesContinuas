import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLogin, Usuario } from 'src/app/models/usuario';
import { OauthService } from 'src/app/service/oauth.service';
import { ToastrService } from 'ngx-toastr';
import { Rol } from 'src/app/models/rol';
import { RecuperarService } from 'src/app/service/recuperar-password.service';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@firebase/auth';
import { UsuarioService } from 'src/app/service/usuario.service';

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
    private toastrService: ToastrService,
    private recuperarService: RecuperarService,
    private auth: AngularFireAuth,
    private usuarioService: UsuarioService
  ) {}
  ngOnInit(): void {}

  showSpinner: any;

  public roles: Rol[] = [];

  public rolLocalStorage?: any;

  public info?: any;
  public user: UserLogin = new UserLogin();
  public login() {
    if (this.user) {
      this.oauthService.login(this.user).subscribe(
        (data) => {
          if (data != null) {
            this.info = data;

            // console.log(data?.token?)

            this.roles = this.info.user.roles!;
            localStorage.removeItem('id_username');
            localStorage.removeItem('id_persona');
            localStorage.removeItem('foto');
            localStorage.removeItem('rol');
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            if (this.info.user.estadoUsuarioActivo == false) {
              this.toastrService.error(
                'Lo sentimos su cuenta esta desactidada, contactate con los administradores.s',
                'CUENTA DESACTIVADA',
                {
                  timeOut: 3000,
                }
              );
            } else {
              localStorage.setItem('token', String(this.info.token));
              //Almacenar en el storage
              localStorage.setItem(
                'id_username',
                String(this.info.user.idUsuario)
              );
              localStorage.setItem(
                'id_persona',
                String(this.info.user.persona?.idPersona)
              );
              localStorage.setItem('foto', String(this.info.user.fotoPerfil));

              localStorage.setItem('username', String(this.info.user.username));

              if (this.info.user.roles?.length! > 1) {
                this.modalView();
              } else {
                this.toastrService.success('Bienvenido', 'Ingreso Exitoso', {
                  timeOut: 1500,
                  progressBar: true,
                  progressAnimation: 'increasing',
                });

                for (let rol of this.info.user.roles!) {
                  localStorage.setItem('rol', String(rol.nombreRol));
                }

                setTimeout(() => {
                  this.showSpinner = false;
                  window.location.reload();
                  location.replace('/home');
                }, 1500);
              }
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
        },
        (err) => {
          this.toastrService.error(
            'Revise sus Credenciales de acceso.',
            'Usuario no registrado',
            {
              timeOut: 3000,
            }
          );
        }
      );
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

  //VALIDACION DENTRO DEL LOGIN CREDENCIALES CORRECTAS
  public loginNext() {}

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

  //ROL NO ASIGNADO
  public visibleRolnoAsignado?: boolean = false;
  public modalViewRolNoasigando() {
    this.visibleRolnoAsignado = true;
  }

  // RECUPERAR CONTRASEÑA
  isSendCorreo: Boolean = false;
  cedulaReset?: String;
  public visibleRecuperarPassword?: boolean = false;
  public modalViewRecuperarPassword() {
    this.visibleRecuperarPassword = true;
  }

  public enviarCorreo() {
    this.showSpinner = true;
    if (this.cedulaReset == '' || this.cedulaReset == null) {
      this.toastrService.error('Digite su cédula', 'Campo vacio');
    } else {
      this.oauthService.getUsuarioByIdentificacion(this.cedulaReset).subscribe(
        (data) => {
          this.recuperarService
            .sendCorreoRecuperacion(this.cedulaReset!)
            .subscribe((data) => {
              console.log(data);
              this.toastrService.success('Correo enviado', 'Revise su correo');
              this.isSendCorreo = true;
              setTimeout(() => {
                this.showSpinner = false;
                window.location.reload();
                location.replace('/welcome');
              }, 1800);
            });
        },
        (Error) => {
          this.toastrService.error(
            'Usuario inexistente',
            'Vetifique su identifiación'
          );
        }
      );
    }
  }

  //VALIDACION CON GOOGLE
  public googleAuth() {
    this.oauthService.logOut();

    this.oauthService
      .authLogin(new GoogleAuthProvider())
      .then((result) => {
        console.log(result);
        this.auth.authState.subscribe((data) => {
          // console.log(data?.displayName!);
          // console.log(data?.email!);
          // console.log(data?.emailVerified!);
          // console.log(data?.photoURL!);

          this.validarDatosGoogle(data?.email!);

        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public validarDatosGoogle(email: any){
    this.usuarioService.getFindUsuarioByEmail(email).subscribe((data)=>{
      if(data != null){
        this.user.username = data.username;
        this.user.password = data.password;
        this.login();
        // public user: UserLogin = new UserLogin();
      }
    })
  }
}
