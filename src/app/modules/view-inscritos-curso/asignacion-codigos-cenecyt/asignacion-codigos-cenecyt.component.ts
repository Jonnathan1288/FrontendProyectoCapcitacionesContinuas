import { Component, OnInit } from '@angular/core';
import { ParticipantesAprobados } from 'src/app/models/participantes-aprobados';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { CursoService } from 'src/app/service/curso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Curso } from 'src/app/models/curso';
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
})
export class AsignacionCodigosCenecytComponent implements OnInit {
  //CODIGO DE PRIME

  loading: boolean = false;

  //DONDE INICIAMOS CON LA PARTE FUNCIONAL DEL COMPONENETE
  public classParicipanteAprovado = new ParticipantesAprobados();

  public listparticipanteAprovado: ParticipantesAprobados[] = [];

  public editing?: boolean = false;
  public capturarIdCurso?: any;
  private sanitizer!: DomSanitizer;

  public idUsuarioIsLoggin?: any;
  public listCursoCapacitador: Curso[] = [];
  constructor(
    private participantesAprovadoService: ParticipanteAprobadoService,
    private reportService: ReportsCapacitacionesService,
    sanitizer: DomSanitizer,
    private cursoService: CursoService
  ) {
    this.sanitizer = sanitizer;
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
        console.log(data);
      });
  }

  //Captura el curs
  public classCourseSelected = new Curso();
  public catchCourseSelected(curso: Curso){
    this.classCourseSelected = {...curso};

  }

  //Veneto para obtener los curso que tengo
  public idCursoFinalRepors?: any
  onCursoSelectionChange(event: any) {
    
    const selectedOption = event.value;
    const selectedCursoId = selectedOption ? selectedOption.idCurso : null;
    console.log("id->  :", selectedCursoId);
    this.loading = true;
    this.idCursoFinalRepors = selectedCursoId;
    this.getParticipanteAprovadoPorIdCursoParCodigosCenecyt(selectedCursoId);

  }
  

  public getParticipanteAprovadoPorIdCursoParCodigosCenecyt(idCurso: number) {
    this.participantesAprovadoService
      .getAllParticipantesAprobadosByIdCurso(idCurso)
      .subscribe((data) => {
        if (data != null) {
          this.listparticipanteAprovado = data;
          this.listFilterEstudiantesAprovados = this.listparticipanteAprovado;
          this.loading = false;
        }
      });
  }

  onRowEditInit() {
    this.editing = true;
  }

  onRowEditSave() {
    const participantesAprobadosCopy = this.listparticipanteAprovado.map(
      (participante) => {
        const participanteCopy = { ...participante }; // Copiar el objeto original
        if (participanteCopy.certificadoParticipante) {
          participanteCopy.certificadoParticipante =
            participanteCopy.certificadoParticipante
              .replace('SafeResourceUrlImpl', '')
              .replace('changingThisBreaksApplicationSecurity', '');
        }
        return participanteCopy;
      }
    );

    console.log(participantesAprobadosCopy);

    this.participantesAprovadoService
      .updateParticipantesAprobadosLista(participantesAprobadosCopy)
      .subscribe(
        (data) => {
          if (data != null) {
            alert('Update successful');
            this.editing = false;
          }
        },
        (err) => {
          alert(err.error);
          this.editing = false;
        }
      );
  }

  onRowEditCancel() {
    this.editing = false;
  }


  //SUBIR PDF PARA SU CERTIFICADO FIRMADO..
  pdfSrc: SafeResourceUrl | undefined;


  handleFileInput(
    event: any,
    rowIndex: number,
    certificado: ParticipantesAprobados
  ) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Pdf = reader.result as string;
      this.listparticipanteAprovado[rowIndex].certificadoParticipante =
        'data:application/pdf;base64,' + base64Pdf.split(',')[1];
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64Pdf);
    };

    console.log(this.listparticipanteAprovado)
    this.showModaLImprimirMensal(certificado);

    reader.readAsDataURL(file);
  }

  //
  public valida?: boolean = false;

  //IMPLEMENTACION DE LA VISUALIZACIN DEL PDF

  //Implementacion de la fecha para extraer por mes
  public visiblePeriodoMensual?: boolean = false;
  public classCertificado = new ParticipantesAprobados();
  public showModaLImprimirMensal(certificado: ParticipantesAprobados) {

    this.classCertificado = { ...certificado };
    
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl('' + this.classCertificado.certificadoParticipante);
    this.visiblePeriodoMensual = true;
    // this.getCertificadoFirmado();
  }

  public closeTitulo(){
    this.visiblePeriodoMensual = false;
  }

  //BUSCAR POR EL ID DE CERTIFICADOS
  participantesAprobados: ParticipantesAprobados | undefined;
  public getCertificadoFirmado(){
    this.participantesAprovadoService.getParticipantesAprobadosById(4).subscribe((data)=>{
      if(data != null){
        // console.log(data)
        this.classCertificado = data;
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(''+this.classCertificado.certificadoParticipante);
        console.log(this.pdfSrc)
        // this.pdfSrcExel = this.sanitizer.bypassSecurityTrustResourceUrl(this.pruebaPdf.exel!);
      }
    })
  }

  //Implementacion de los filtros()

  
  //Implementacion de los filtros
  public wordNoFind?: any;
  public listFilterEstudiantesAprovados: ParticipantesAprobados[]=[];
  public filterTableEventParticipantesAprovados(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {

      this.listFilterEstudiantesAprovados = this.listparticipanteAprovado;
      // this.numerFoundCountAnimal = this.listALLAnimals.length;
    } else {
      let filteredAnimals = this.listFilterEstudiantesAprovados.filter(
        (usuario) =>
          (usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.nombre1?.toLowerCase().includes(this.wordNoFind) ||
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.nombre2?.toLowerCase().includes(this.wordNoFind) ||
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.apellido1?.toLowerCase().includes(this.wordNoFind) || 
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.apellido2?.toLowerCase().includes(this.wordNoFind) ||
          usuario.partipantesMatriculados?.inscrito?.usuario?.persona?.identificacion?.toLowerCase().includes(this.wordNoFind) 
          )
      );
      
      this.listFilterEstudiantesAprovados = filteredAnimals;
    }
  }


  //TODO DE LO QUE SON REPORTES 
    //IMPRIMIR TODOS LOS ESTUDIANTES APROVADOS POR CURSO CO CODIGOS DE LA SENECYT
    public getCodigosSenecytDownload() {
      this.reportService.downloadCodigosSenecyt(this.idCursoFinalRepors).subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
      // this.getPdf()
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
  
}
