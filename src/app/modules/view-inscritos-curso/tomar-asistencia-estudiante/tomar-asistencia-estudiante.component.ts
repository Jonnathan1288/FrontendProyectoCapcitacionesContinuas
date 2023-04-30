import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from 'src/app/models/asistencia';

@Component({
  selector: 'app-tomar-asistencia-estudiante',
  templateUrl: './tomar-asistencia-estudiante.component.html',
  styleUrls: ['./tomar-asistencia-estudiante.component.css'],
})
export class TomarAsistenciaEstudianteComponent implements OnInit {
  public asistenciaEstudiante = new Asistencia();
  //Para capturar el id de los matriculados
  public idEstudiantesMatriculados?: number;
  constructor(private activateRoute: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idEstudiantesM = param['id'];
      this.idEstudiantesMatriculados = idEstudiantesM;
      // this.traerParticipantesMatriculados(this.idCursoMatricula!);
    });
  }


}
