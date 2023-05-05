import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitador } from 'src/app/models/capacitador';
import { Curso } from 'src/app/models/curso';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-list-course',
  templateUrl: './list-course.component.html',
  styleUrls: ['./list-course.component.css'],
})
export class ListCourseComponent implements OnInit {
  public curso = new Curso();
  public capacitador = new Capacitador();

  public cursoList: Curso[] = [];

  first = 0;

  rows = 5;

  public idUsuarioIsLoggin: any;
  public idCapacitador: any;
  constructor(
    private cursoService: CursoService,
    private router: Router,
    private actiRouter: ActivatedRoute,
    private capacitadorService: CapacitadorService
  ) {}

  ngOnInit(): void {
    this.idUsuarioIsLoggin = localStorage.getItem('id_username');
    this.listCourseporUsuarioLogin(this.idUsuarioIsLoggin);
  }

  public listCourseporUsuarioLogin(idUsuario: number) {
    this.cursoService
      .obtenerTodoslosCursosPorIdUsuario(idUsuario)
      .subscribe((data) => {
        this.cursoList = data;
        console.log(data);
      });
  }

  public silabo(idcurso: number) {
    this.router.navigate(['/silabo', idcurso]);
  }

  public editCurso(idcurso: number) {
    this.router.navigate(['/register/course', idcurso]);
  }

  public necesidadCurso(idcurso: number) {
    this.router.navigate(['/register/necesidad', idcurso]);
  }

  public VerCursoInicio(idCurso: number) {
    this.router.navigate(['/verMatriculados/course/inicio', idCurso]);
  }

  public VerParticipantesInscritos(idCurso: number) {
    this.router.navigate(['/verInscritos/course/', idCurso]);
  }

  public VerRegistroFotografico(idCurso: number) {
    this.router.navigate(['/registro/fotografico/curso/', idCurso]);
  }

  //Actualizar el curso para que sea publico
  public updateEstadoPublico(curso: Curso){
    curso.estadoPublicasionCurso = 'V';
    curso.estadoCurso = true;
    console.log({datapreview: curso})
    this.cursoService.updateCurso(curso.idCurso!, curso).subscribe((data)=>{
      if(data != null){
        console.log({json: data})
        alert('Succesful published')
      }
    })
    
  }

  //Implementacion de la tabla de todo referente a primeng
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.cursoList
      ? this.first === this.cursoList.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.cursoList ? this.first === 0 : true;
  }


  //IMPLEMENTACION DEL MODAL PARA VISULIZAR 
  public visibleCursoPublicar?: boolean = false;
  public cursoViewPublished = new Curso();
  // public palabras: any;
  public showModaLPublisedCourse(curso: Curso) {
    this.cursoViewPublished = {...curso}
    this.visibleCursoPublicar = true;
  }

  public closeModalView(){
    this.visibleCursoPublicar = false;
  }
}
