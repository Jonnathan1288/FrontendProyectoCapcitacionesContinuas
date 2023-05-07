import { Component, OnInit } from '@angular/core';
import { ParticipantesAprobados } from 'src/app/models/participantes-aprobados';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { CursoService } from 'src/app/service/curso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';

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
  constructor(
    private participantesAprovadoService: ParticipanteAprobadoService,
    private reportService: ReportsCapacitacionesService
  ) {}

  ngOnInit(): void {
    this.getParticipanteAprovadoPorIdCursoParCodigosCenecyt(2);
  }

  public getParticipanteAprovadoPorIdCursoParCodigosCenecyt(idCurso: number) {
    this.participantesAprovadoService
      .getAllParticipantesAprobadosByIdCurso(idCurso)
      .subscribe((data) => {
        if (data != null) {
          this.listparticipanteAprovado = data;
        }
      });
  }

  onRowEditInit() {
    this.editing = true;
  }

  onRowEditSave() {
    this.participantesAprovadoService
      .updateParticipantesAprobadosLista(this.listparticipanteAprovado)
      .subscribe(
        (data) => {
          if (data != null) {
            alert('update succesful');
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

  //IMPRIMIR TODOS LOS ESTUDIANTES APROVADOS POR CURSO CO CODIGOS DE LA SENECYT
  public getCodigosSenecytDownload() {
    this.reportService
      .downloadCodigosSenecyt(2)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
    // this.getPdf()
  }
  
}
