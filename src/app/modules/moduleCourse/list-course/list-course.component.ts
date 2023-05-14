import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Capacitador } from 'src/app/models/capacitador';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-list-course',
  templateUrl: './list-course.component.html',
  styleUrls: ['./list-course.component.css'],
})
export class ListCourseComponent implements OnInit {
  public curso = new Curso();
  public capacitador = new Capacitador();
  public items: any;
  public cursoList: Curso[] = [];

  first = 0;
  layout: string = 'list';
  rows = 5;

  public idUsuarioIsLoggin: any;
  public idCapacitador: any;
  constructor(
    private cursoService: CursoService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // this.opcionesBotonesLista();
    this.idUsuarioIsLoggin = localStorage.getItem('id_username');
    this.listCourseporUsuarioLogin(this.idUsuarioIsLoggin);
  }

  public idCapClicl!: number;
  capId(idCurso: number) {
    alert(idCurso);
    this.idCapClicl = idCurso;
  }

  public listCourseporUsuarioLogin(idUsuario: number) {
    this.cursoService
      .obtenerTodoslosCursosPorIdUsuario(idUsuario)
      .subscribe((data) => {
        this.cursoList = data;
        console.log(data);
      });
  }




  //Actualizar el curso para que sea publico
  public updateEstadoPublico(curso: Curso) {
    curso.estadoPublicasionCurso = 'V';
    curso.estadoCurso = true;
    console.log({ datapreview: curso });
    this.cursoService.updateCurso(curso.idCurso!, curso).subscribe((data) => {
      if (data != null) {
        console.log({ json: data });
        alert('Succesful published');
      }
    });
  }

  //IMPLEMENTACION DEL MODAL PARA VISULIZAR
  public visibleCursoPublicar?: boolean = false;
  public cursoViewPublished = new Curso();
  // public palabras: any;
  public showModaLPublisedCourse(curso: Curso) {
    this.cursoViewPublished = { ...curso };
    this.visibleCursoPublicar = true;
  }

  public closeModalView() {
    this.visibleCursoPublicar = false;
  }

  //IMPLEMENTACION PARA LA IDICIÓN DEL CURSO-------------------------------------
  public editarCursoCapacitadionContinua() {
    this.router.navigate(['/register/course', this.cursoViewPublished.idCurso]);
  }

  public updatePublicCursosCapacitacion() {
    this.cursoViewPublished.estadoPublicasionCurso = 'V';
    this.cursoViewPublished.estadoCurso = true;
    this.cursoService
      .updateCurso(this.cursoViewPublished.idCurso!, this.cursoViewPublished)
      .subscribe((data) => {
        if (data != null) {
          // alert('Succesful published course')
          this.toastrService.success(
            'Publicando',
            'Publicasión del curso éxitosa',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      });
  }

  public visiblePeriodoMensual?: boolean = false;
  public classNewCourse = new Curso();
  public modalViewoption(curso: Curso) {
    this.classNewCourse = { ...curso };
    this.visiblePeriodoMensual = true;
  }

  //VISIVILIDAD DEL CURSO

  public newCursoCapcitacion() {
    this.router.navigate(['/register/course']);
  }


  public editCurso(idcurso: number) {
    this.router.navigate(['/register/course', idcurso]);
  }

  public VerCursoInicio(idCurso: number, estadoFinal: String) {
    localStorage.setItem('status', String(estadoFinal));

    this.router.navigate(['/verMatriculados/course/inicio', idCurso]);
  }

  public VerParticipantesInscritos(idCurso: number) {
    this.router.navigate(['/verInscritos/course/', idCurso]);
  }

  public editarCurso() {
    this.router.navigate(['/register/course', this.classNewCourse.idCurso]);
  }

  public necesidadCurso() {
    this.router.navigate(['/register/necesidad', this.classNewCourse.idCurso]);
  }

  public generacionSilaboCurso() {
    this.router.navigate(['/silabo', this.classNewCourse.idCurso]);
  }

  public reistroFotograficoCurso() {
    this.router.navigate([
      '/registro/fotografico/curso/',
      this.classNewCourse.idCurso,
    ]);
  }

  clear(table: Table) {
    table.clear();
  }
}
