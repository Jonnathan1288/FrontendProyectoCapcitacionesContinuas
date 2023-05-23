import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CambiarPasswordDTO } from 'src/app/models/usuario';
import { RecuperarService } from 'src/app/service/recuperar-password.service';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent implements OnInit {

  constructor(
    private toastService: ToastrService,
    private recuperarService: RecuperarService,
    private actiRouter: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const token = params['token'];
      this.usuarioReset.tokenPassword = token;
      console.log("token -> " + this.usuarioReset.tokenPassword + " el cons -> " + token)
    });
  }

  usuarioReset: CambiarPasswordDTO = new CambiarPasswordDTO();

  public cambiarContrasenia():void{
    if (!this.usuarioReset.password || !this.usuarioReset.confirmPassword || !this.usuarioReset.tokenPassword) {
      this.toastService.warning(
        'Llene todos los campos.',
        'Uno o más campos vacios.'
      );
    } else {
      this.recuperarService.cambiarContraseña(this.usuarioReset).subscribe(
        data =>{
          this.toastService.success('Contraseña restaurada','Su contraseña se ha restablezido');
          location.replace('/welcome');
        }
      )
    }
  }



}
