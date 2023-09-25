import { Component, OnInit } from '@angular/core';
import { ParticipantesAprobados } from 'src/app/models/participantes-aprobados';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { CursoService } from 'src/app/service/curso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Curso } from 'src/app/models/curso';
import { Message, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { ParticipantsApproved } from 'src/app/models/references/participants-approved';
@Component({
  selector: 'app-asignacion-codigos-cenecyt',
  templateUrl: './asignacion-codigos-cenecyt.component.html',
  styleUrls: ['./asignacion-codigos-cenecyt.component.css'],

})
export class AsignacionCodigosCenecytComponent implements OnInit {
  //CODIGO DE PRIME

  loading: boolean = false;

  //DONDE INICIAMOS CON LA PARTE FUNCIONAL DEL COMPONENETE
  public classParicipanteAprovado = new ParticipantesMatriculados();


  public editing?: boolean = false;
  public capturarIdCurso?: any;

  public idUsuarioIsLoggin?: any;
  public listCursoCapacitador: Curso[] = [];

  ///
  public listParticipantsApproved: ParticipantsApproved[] = [];
  constructor(
    private participantesAprovadoService: ParticipanteAprobadoService,
    private reportService: ReportsCapacitacionesService,

    private cursoService: CursoService,
  ) {

  }

  ngOnInit(): void {
    this.idUsuarioIsLoggin = localStorage.getItem('id_username');
    this.listCourseporUsuarioLogin(this.idUsuarioIsLoggin);

  }

  public listCourseporUsuarioLogin(idUsuario: number) {
    this.cursoService
      .obtenerTodoslosCursosPorIdUsuario(idUsuario)
      .subscribe((data) => {
        this.listCursoCapacitador = data;

        this.listCursoCapacitador = data.filter(
          (cursosFinalizados) =>
            cursosFinalizados.estadoPublicasionCurso === 'F'
        );
      });
  }

  //Captura el curs
  public classCourseSelected = new Curso();
  public catchCourseSelected(curso: Curso) {
    this.classCourseSelected = { ...curso };
  }

  //Veneto para obtener los curso que tengo
  public idCursoFinalRepors?: any;
  onCursoSelectionChange(event: any) {
    const selectedOption = event.value;
    const selectedCursoId = selectedOption ? selectedOption.idCurso : null;
    console.log('id->  :', selectedCursoId);
    this.loading = true;
    this.idCursoFinalRepors = selectedCursoId;
    this.getParticipanteAprovadoPorIdCursoParCodigosCenecyt(selectedCursoId);
  }

  public getParticipanteAprovadoPorIdCursoParCodigosCenecyt(idCurso: number) {
    this.participantesAprovadoService
      .getParticipantesAprobadosByDocenteIdCurso(idCurso)
      .subscribe((data) => {
        if (data != null) {

          this.listParticipantsApproved = data

          this.loading = false;
        }
      });
  }

  //TODO DE LO QUE SON REPORTES
  //IMPRIMIR TODOS LOS ESTUDIANTES APROVADOS POR CURSO CO CODIGOS DE LA SENECYT
  public getCodigosSenecytDownload() {
    this.reportService
      .downloadCodigosSenecyt(this.idCursoFinalRepors)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  //IMPRIMIR TODOS LOS ESTUDIANTES APROVADOS POR CURSO CO CODIGOS DE LA SENECYT
  public getEstudiantesParaHacerFirmar() {
    this.reportService
      .downloadEntregaCertificadoEstudiante(this.idCursoFinalRepors)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  //IMPRIMIR FICCHA EVALUACION FINAL CURSO
  public getFichaEvalucaionFinalCurso() {
    this.reportService
      .downloadFichaEvaluacionFinalCurso(this.idCursoFinalRepors)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }


  // downloadCertificadoEstudiante}
}