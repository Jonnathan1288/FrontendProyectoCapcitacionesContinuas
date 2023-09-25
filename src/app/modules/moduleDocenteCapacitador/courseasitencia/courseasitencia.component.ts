import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-courseasitencia',
  templateUrl: './courseasitencia.component.html',
  styleUrls: ['./courseasitencia.component.css']
})
export class CourseasitenciaComponent implements OnInit {

  public idUsuarioIsLoggin: any;
  public cursoList: Curso[] = [];
  idCurso: number; 
  estadoFinal: string; 
  ngOnInit(): void {
  
    this.classCourseSelected = new Curso();

  
  }
  constructor(private cursoService: CursoService, private router: Router, private toastrService: ToastrService) {

    this.cursoList = [];
    this.classCourseSelected = new Curso();

    this.idCurso = 1; 
    this.estadoFinal = 'F'; 

    this.idUsuarioIsLoggin = localStorage.getItem('id_username');

    if (this.idUsuarioIsLoggin) {
      this.listCourseporUsuarioLogin(Number(this.idUsuarioIsLoggin));
    }
  }


  public listCourseporUsuarioLogin(idUsuario: number) {
    this.cursoService
      .obtenerTodoslosCursosPorIdUsuario(idUsuario)
      .subscribe((data) => {
        this.cursoList = data;
        console.log(data);
      });
  }


  public classCourseSelected = new Curso();
  public cursoSeleccionado: boolean = false;

  cursoSeleccionadoChange(event: any) {
    const selectedOption = event.value;
    this.cursoSeleccionado = selectedOption !== null;
    this.classCourseSelected = selectedOption;
  }


  cursoDeseleccionado() {
    this.cursoSeleccionado = false;
    this.classCourseSelected = new Curso();;
  }


  //VISIVILIDAD DEL CURSO


  public editarCurso() {


    if (this.classCourseSelected && this.classCourseSelected.idCurso) {

      this.router.navigate(['/register/course', this.classCourseSelected.idCurso]);
    } else {
      console.log("Error: Debes seleccionar un curso antes de generar el sílabo.");

      this.toastrService.error("Debes seleccionar un curso antes de Editar  curso", "Error");
    }

  }

  public necesidadCurso() {

    if (this.classCourseSelected && this.classCourseSelected.idCurso) {

      this.router.navigate(['/register/necesidad', this.classCourseSelected.idCurso]);
    } else {
      console.log("Error: Debes seleccionar un curso antes de generar el sílabo.");

      this.toastrService.error("Debes seleccionar un curso antes de generar la Necesidad de Curso.", "Error");
    }

  }


  public generacionSilaboCurso() {
    if (this.classCourseSelected && this.classCourseSelected.idCurso) {

      this.router.navigate(['/silabo', this.classCourseSelected.idCurso]);
    } else {
      console.log("Error: Debes seleccionar un curso antes de generar el sílabo.");

      this.toastrService.error("Debes seleccionar un curso antes de generar el sílabo.", "Error");
    }
  }


  public reistroFotograficoCurso() {

    if (this.classCourseSelected && this.classCourseSelected.idCurso) {

      this.router.navigate(['/registro/fotografico/curso/', this.classCourseSelected.idCurso,]);
    } else {

      this.toastrService.error("Debes seleccionar un curso antes de generar el Registro fotográfico", "Error");
    }

  }
  
  mostrarNombreCurso() {
  
    if (this.classCourseSelected) {
      console.log("Nombre del curso seleccionado:", this.classCourseSelected.nombreCurso);
      localStorage.setItem('status', this.estadoFinal);

      this.router.navigate(['/verMatriculados/course/inicio', this.idCurso]);
    } else {
      console.log("Ningún curso seleccionado.");
    }
  }

public VerCursoInicio() {
  if (this.classCourseSelected) {
    const idCurso = this.classCourseSelected.idCurso;
    const estadoFinal = this.classCourseSelected.estadoPublicasionCurso;

    console.log("Nombre del curso seleccionado:", this.classCourseSelected.nombreCurso);
    console.log("Estado:", estadoFinal);

    localStorage.setItem('status', String(estadoFinal));

    this.router.navigate(['/verMatriculados/course/inicio', idCurso]);
  } else {
    console.log("Ningún curso seleccionado.");
  }
}
}


