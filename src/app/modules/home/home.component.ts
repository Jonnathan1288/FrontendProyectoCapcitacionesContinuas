import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Usuario } from 'src/app/models/usuario';
import { CursoService } from 'src/app/service/curso.service';
import { PersonaService } from 'src/app/service/persona.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  
  public idUsuarioIsLoggin: any;
  public rolNameUser?: any;

  public cursoList: Curso[]=[];

  constructor(
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.idUsuarioIsLoggin = localStorage.getItem('id_username');
    this.obternerDatosUsuarioLoggin(this.idUsuarioIsLoggin);
    this.rolNameUser = localStorage.getItem('rol');
    this.obternerDatosUsuarioLogginRoles(this.rolNameUser);
    this.listCourseporUsuarioLogin(this.idUsuarioIsLoggin);
  }

  public numeroCursos?: number;
  public numeroCursosIniciados?: number;
  public numeroCursosPublicados?: number;
  public numeroCursosFinalizados?: number;


  public listCourseporUsuarioLogin(idUsuario: number) {
    this.cursoService
      .obtenerTodoslosCursosPorIdUsuario(idUsuario)
      .subscribe((data) => {
        this.cursoList = data;

        this.numeroCursos = this.cursoList.length;
        this.numeroCursosIniciados = this.cursoList.filter((c)=>c.estadoPublicasionCurso === 'I').length;
        this.numeroCursosPublicados = this.cursoList.filter((c)=>c.estadoPublicasionCurso === 'P').length;
        this.numeroCursosFinalizados = this.cursoList.filter((c)=>c.estadoPublicasionCurso === 'F').length;
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

  verCursos(){
    this.router.navigate(['cards/course']).then(() => {
      // window.location.reload();
    });
  }

  isAdministrador: boolean = false;
  isCapacitador: boolean = false;
  isParticipante: boolean = false;

  public obternerDatosUsuarioLogginRoles(nombreRol:any): void {
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
