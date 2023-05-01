import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { PersonaService } from 'src/app/service/persona.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  
  constructor(
    private usuarioService: UsuarioService,
    private personaService: PersonaService,
    private router: Router,
  ) {}


  public idUsuarioIsLoggin: any;

  ngOnInit(): void {
    this.idUsuarioIsLoggin = localStorage.getItem('id_username');
    this.obternerDatosUsuarioLoggin(this.idUsuarioIsLoggin);
  }

  usuario: Usuario = new Usuario();

  public obternerDatosUsuarioLoggin(idUsuarioLogin:number):void{
    this.usuarioService.getUsuarioById(idUsuarioLogin).subscribe(
      data =>{
        this.usuario = data;
      }
    )
  }

  verCursos(){
    this.router.navigate(['cards/course']).then(() => {
      // window.location.reload();
    });
  }

}
