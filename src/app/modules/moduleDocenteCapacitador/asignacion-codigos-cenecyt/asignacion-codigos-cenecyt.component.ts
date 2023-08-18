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
@Component({
  selector: 'app-asignacion-codigos-cenecyt',
  templateUrl: './asignacion-codigos-cenecyt.component.html',
  styleUrls: ['./asignacion-codigos-cenecyt.component.css'],
  styles: [
    `
      :host ::ng-deep .p-cell-editing {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
    `,
  ],
  providers: [MessageService],
})
export class AsignacionCodigosCenecytComponent implements OnInit {
  //CODIGO DE PRIME

  loading: boolean = false;

  //DONDE INICIAMOS CON LA PARTE FUNCIONAL DEL COMPONENETE
  public classParicipanteAprovado = new ParticipantesMatriculados();

  public listparticipanteAprovado: ParticipantesMatriculados[] = [];

  public editing?: boolean = false;
  public capturarIdCurso?: any;
  private sanitizer!: DomSanitizer;

  public idUsuarioIsLoggin?: any;
  public listCursoCapacitador: Curso[] = [];

  mesajePantalla: String = 'Vacio';

  msgs1: Message[] = [];
  constructor(
    private participantesAprovadoService: ParticipanteAprobadoService,
    private reportService: ReportsCapacitacionesService,
    sanitizer: DomSanitizer,
    private cursoService: CursoService,
    private messageService: MessageService,
    private toastrService: ToastrService
  ) {
    this.sanitizer = sanitizer;
  }

  ngOnInit(): void {
    this.idUsuarioIsLoggin = localStorage.getItem('id_username');
    this.listCourseporUsuarioLogin(this.idUsuarioIsLoggin);

    this.msgs1 = [
      // {severity:'success', summary:'Success', detail:'Message Content'},
      // {severity:'info', summary:'Info', detail:'Message Content'},
      // {severity:'warn', summary:'Warning', detail:'Message Content'},
      {
        severity: 'error',
        summary: 'Error',
        detail: 'Este estudiante aún no tiene certificado firmado.',
      },
      // {severity:'custom', summary:'Custom', detail:'Message Content', icon: 'pi-file'}
    ];
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
    // this.getParticipanteAprovadoPorIdCursoParCodigosCenecyt(selectedCursoId);
  }

  // public getParticipanteAprovadoPorIdCursoParCodigosCenecyt(idCurso: number) {
  //   this.participantesAprovadoService
  //     .getAllParticipantesAprobadosByIdCurso(idCurso)
  //     .subscribe((data) => {
  //       if (data != null) {
  //         console.log(data)
  //         this.listparticipanteAprovado = data;
  //         this.listFilterEstudiantesAprovados = this.listparticipanteAprovado;
  //         this.loading = false;
  //       }
  //     });
  // }

  public onRowEditInit() {
    this.editing = true;
  }

  public isCodigoDuplicado: boolean = false;

  onRowEditCancel() {
    this.editing = false;
  }

  //SUBIR PDF PARA SU CERTIFICADO FIRMADO..
  pdfSrc: SafeResourceUrl | undefined;


  //
  public valida?: boolean = false;

  //IMPLEMENTACION DE LA VISUALIZACIN DEL PDF

  //Implementacion de la fecha para extraer por mes
  public visiblePeriodoMensual?: boolean = false;
  public classCertificado = new ParticipantesAprobados();
  public showModaLImprimirMensal(certificado: ParticipantesAprobados) {
    this.pdfSrc = '';
    this.classCertificado = { ...certificado };

    if (this.classCertificado.certificadoParticipante === null) {
      this.pdfSrc = '';
    } else {
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        '' + this.classCertificado.certificadoParticipante
      );
    }

    this.visiblePeriodoMensual = true;
  }

  public closeTitulo() {
    this.visiblePeriodoMensual = false;
  }

  //BUSCAR POR EL ID DE CERTIFICADOS
  participantesAprobados: ParticipantesAprobados | undefined;
  public getCertificadoFirmado() {
    this.participantesAprovadoService
      .getParticipantesAprobadosById(4)
      .subscribe((data) => {
        if (data != null) {
          // console.log(data)
          this.classCertificado = data;
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
            '' + this.classCertificado.certificadoParticipante
          );
          console.log(this.pdfSrc);
          // this.pdfSrcExel = this.sanitizer.bypassSecurityTrustResourceUrl(this.pruebaPdf.exel!);
        }
      });
  }

  //Implementacion de los filtros()

  //Implementacion de los filtros
  public wordNoFind?: any;
  public listFilterEstudiantesAprovados: ParticipantesMatriculados[] = [];
  public filterTableEventParticipantesAprovados(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      this.listFilterEstudiantesAprovados = this.listparticipanteAprovado;
    } else {
      // let filteredAnimals = this.listparticipanteAprovado.filter(
      //   (usuario) =>
      //     usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.nombre1
      //       ?.toLowerCase()
      //       .includes(this.wordNoFind) ||
      //     usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.nombre2
      //       ?.toLowerCase()
      //       .includes(this.wordNoFind) ||
      //     usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.apellido1
      //       ?.toLowerCase()
      //       .includes(this.wordNoFind) ||
      //     usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.apellido2
      //       ?.toLowerCase()
      //       .includes(this.wordNoFind) ||
      //     usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.identificacion
      //       ?.toLowerCase()
      //       .includes(this.wordNoFind)
      // );

      // this.listFilterEstudiantesAprovados = filteredAnimals;
    }
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

  //DESCARGAR CERTIFICADO DE CADAD ESTUDIANTE

  public downloadCertificadoEstudianteSenecytDownload(
    participanteAprovado: ParticipantesAprobados
  ) {
    this.reportService
      .downloadCertificadoEstudiante(
        participanteAprovado.partipantesMatriculados?.inscrito?.curso?.idCurso!,
        participanteAprovado.partipantesMatriculados?.inscrito?.usuario?.persona
          ?.identificacion!
      )
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  // downloadCertificadoEstudiante}
}
