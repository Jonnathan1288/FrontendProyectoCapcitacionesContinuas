import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from 'src/app/models/asistencia';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';

@Component({
  selector: 'app-view-inicio-curso-matriculados',
  templateUrl: './view-inicio-curso-matriculados.component.html',
  styleUrls: ['./view-inicio-curso-matriculados.component.css'],
})
export class ViewInicioCursoMatriculadosComponent implements OnInit {
  public listParticipantesMatriculados: ParticipantesMatriculados[] = [];
  public idCursoMatricula?: number;

  public asistenciaEstudiante = new Asistencia();

  constructor(
    private participantesMatriculadosService: ParticipanteMatriculadoService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idCursoRout = param['id'];
      this.idCursoMatricula = idCursoRout;
      this.traerParticipantesMatriculados(this.idCursoMatricula!);
    });
  }

  public traerParticipantesMatriculados(idCurso: number) {
    this.participantesMatriculadosService
      .getParticipantesMatriculadosByIdCurso(idCurso)
      .subscribe((data) => {
        this.listParticipantesMatriculados = data;
      });
  }

  public tomarAsistenciaCurso() {
    this.router.navigate(['/asistencia/estudiantes/course', 1]);
  }

  public tomarNotasFinalesCurso() {
    this.router.navigate(['/notas/estudiantes/course', 2]);
  }

  //Control del modal para el registro de la informaicon visible
  //PARA EL MODAL

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
