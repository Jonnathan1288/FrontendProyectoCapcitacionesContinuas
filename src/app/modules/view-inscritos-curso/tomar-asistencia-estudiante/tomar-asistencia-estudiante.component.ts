import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from 'src/app/models/asistencia';
import { AsistenciaService } from 'src/app/service/asistencia.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tomar-asistencia-estudiante',
  templateUrl: './tomar-asistencia-estudiante.component.html',
  styleUrls: ['./tomar-asistencia-estudiante.component.css'],
})
export class TomarAsistenciaEstudianteComponent implements OnInit {
  today = new Date();
  //La clase para la asistencia
  public asistenciaEstudiante = new Asistencia();

  //Para capturar el id de los matriculados
  public idCursoEstudiantesMatriculados?: number;

//el array de los estudiantes del curso matriculado
public listaAsistenciaE: any[] =[];

  constructor(private activateRoute: ActivatedRoute, private router: Router,
    private asistenciaService:AsistenciaService) {}
  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idEstudiantesM = param['id'];
      this.idCursoEstudiantesMatriculados = idEstudiantesM;
      this.traerListadoEstudiantesMatriculadosAsistencia(this.idCursoEstudiantesMatriculados!);
    });
  }
  

  public traerListadoEstudiantesMatriculadosAsistencia(idCurso: number){
    this.asistenciaService.generarAsistenciaPorFecha(idCurso).subscribe((data)=>{
      if(data != null){
        this.listaAsistenciaE = data;
      }
    })
  }

  public tomarAsistenciaCursoEstudiante(idAsist: any, asistencia: Asistencia){

    this.asistenciaService.updateAsistencia(idAsist, asistencia).subscribe((data)=>{
      if(data != null){
        console.log(data)
      
        alert('Tomado lista')
      }
    })
  }

  public tomarAsistenciaCursoEstudianteCP(){

    this.asistenciaService.updateAsistencia(this.asistenciaEstudiante.idAsistencia!, this.asistenciaEstudiante).subscribe((data)=>{
      if(data != null){
    
      
        alert('Tomado lista')
      }
    })
    this.visible = false
  }


  visible: boolean = false;

  showDialog(asistencia: Asistencia) {
    this.asistenciaEstudiante = { ...asistencia };
    this.visible = true;
  }
}
