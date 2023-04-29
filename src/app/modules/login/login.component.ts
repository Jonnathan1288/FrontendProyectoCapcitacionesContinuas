import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { OauthService } from 'src/app/service/oauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public usuario = new Usuario();
  constructor(private router: Router, private oauthService: OauthService) {}
  ngOnInit(): void {}

  public login() {

    if(this.usuario.username && this.usuario.password){
      this.oauthService
      .login(this.usuario.username ?? '', this.usuario.password ?? '')
      .subscribe((data) => {
        if (data != null) {
          localStorage.removeItem('id_username');
          localStorage.removeItem('id_persona');
          localStorage.removeItem('foto');
          localStorage.removeItem('rol');
          localStorage.removeItem('username');
          alert('Credenciales correctas')
          
          localStorage.setItem('id_username', String(data.idUsuario));
          localStorage.setItem('id_persona', String(data.persona?.idPersona));
          localStorage.setItem('foto', String(data.fotoPerfil));
          localStorage.setItem('rol', String(data.rol?.nombreRol));
          localStorage.setItem('username', String(data.username));
          
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        }else{
          alert('Credenciales erroneans')
        }
      });
    }else{
      alert('Ingre username and password')
    }
    
  }
}
