import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { Usuario } from 'src/app/models/usuario';
import { CapacitadorService } from 'src/app/service/capacitador.service';
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

  public cursoList: Curso[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private cursoService: CursoService,
    private capacitadorService: CapacitadorService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.idUsuarioIsLoggin = localStorage.getItem('id_username');
    this.obternerDatosUsuarioLoggin(this.idUsuarioIsLoggin);
    this.rolNameUser = localStorage.getItem('rol');
    this.obternerDatosUsuarioLogginRoles(this.rolNameUser);
    this.listCourseporUsuarioLogin(this.idUsuarioIsLoggin);

    if (this.rolNameUser === 'DocenteCapacitador') {
      this.capacitadorService
        .getCapacitadorByUsuarioIdUsuario(this.idUsuarioIsLoggin)
        .subscribe((data) => {
          if (data != null) {
            console.log(data);
            if (
              !data.tituloCapacitador ||
              !data.tipoAbreviaturaTitulo ||
              // Ususuario
              !data.usuario?.persona?.apellido1 ||
              !data.usuario?.persona?.apellido2 ||
              !data.usuario?.persona?.nombre2 ||
              !data.usuario?.persona?.nombre1
            ) {
              localStorage.setItem('emp', String('EMPTY'));
              setTimeout(() => {
                this.toastrService.info('', 'INGRESE SUS DATOS');
              }, 500);
              location.replace('/user/edit/data');
            } else {
              localStorage.setItem('emp', String('CHECK'));
            }
          }
        });
    }
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
        this.numeroCursosIniciados = this.cursoList.filter(
          (c) => c.estadoPublicasionCurso === 'I'
        ).length;
        this.numeroCursosPublicados = this.cursoList.filter(
          (c) => c.estadoPublicasionCurso === 'P'
        ).length;
        this.numeroCursosFinalizados = this.cursoList.filter(
          (c) => c.estadoPublicasionCurso === 'F'
        ).length;

        // const l = cursoList.
      });
  }

  usuario: Usuario = new Usuario();

  public obternerDatosUsuarioLoggin(idUsuarioLogin: number): void {
    this.usuarioService.getUsuarioById(idUsuarioLogin).subscribe((data) => {
      this.usuario = data;

      // en el caso para el participante
      if (this.rolNameUser === 'Participante') {
        if (
          // Ususuario
          !this.usuario?.persona?.apellido1 ||
          !this.usuario?.persona?.apellido2 ||
          !this.usuario?.persona?.nombre2 ||
          !this.usuario?.persona?.nombre1 ||
          !this.usuario?.persona?.correo ||
          !this.usuario?.persona?.genero ||
          !this.usuario?.persona?.etnia ||
          !this.usuario?.persona?.fechaNacimiento ||
          !this.usuario?.persona?.direccion ||
          !this.usuario?.persona?.telefono ||
          !this.usuario?.persona?.celular ||
          !this.usuario?.persona?.nivelInstruccion
        ) {
          localStorage.setItem('emp', String('EMPTY'));
          setTimeout(() => {
            this.toastrService.info('', 'DATOS INCOMPLETOS');
          }, 500);
          location.replace('/user/edit/data');
        } else {
          localStorage.setItem('emp', String('CHECK'));
        }
      }
    });
  }

  verCursos() {
    this.router.navigate(['cards/course']).then(() => {
      // window.location.reload();
    });
  }

  isAdministrador: boolean = false;
  isCapacitador: boolean = false;
  isParticipante: boolean = false;

  public obternerDatosUsuarioLogginRoles(nombreRol: any): void {
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
    }
  }
}
