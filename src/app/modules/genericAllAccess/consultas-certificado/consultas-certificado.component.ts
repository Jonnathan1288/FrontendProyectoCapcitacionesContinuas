import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';

@Component({
  selector: 'app-consultas-certificado',
  templateUrl: './consultas-certificado.component.html',
  styleUrls: ['./consultas-certificado.component.css'],
})
export class ConsultasCertificadoComponent implements OnInit {
  private sanitizer!: DomSanitizer;

  public listCourse: Curso[] = [];

  constructor(
    private toastrService: ToastrService,
    private participantesAprovadoService: ParticipanteAprobadoService,
    sanitizer: DomSanitizer,
    private cursoService: CursoService,
    private reportService: ReportsCapacitacionesService,
    private certificadoService: ParticipanteAprobadoService
  ) {
    this.sanitizer = sanitizer;
  }
  ngOnInit(): void {
    this.obtenerTodosLosCursos();
  }

  public obtenerTodosLosCursos() {
    this.cursoService.listCurso().subscribe((data) => {
      if (data != null) {
        this.listCourse = data;
      }
    });
  }

  //DESCARGAR CERTIFICADO DE CADAD ESTUDIANTE
  public downloadCertificadoEstudianteSenecytDownload() {
    this.certificadoService
      .getParticipantesAprobadosidCursoAndIdenitificacion(
        this.idCursoG!,
        this.cedulaIdentificasion!
      )
      .subscribe((data) => {
        if (data != null) {
          if (data.certificadoParticipante) {
            const byteCharacters = atob(
              data.certificadoParticipante!.split(',')[1]
            );
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            this.cedulaIdentificasion = '';
          } else {
            this.reportService
              .downloadCertificadoEstudiante(
                this.idCursoG!,
                this.cedulaIdentificasion!
              )
              .subscribe((r) => {
                if (r.size < 1300) {
                  this.toastrService.error(
                    'Usted no tiene certificado en este curso.',
                    'CERTIFICADO NO ENCONTRADO'
                  );
                  console.log('El objeto está vacío');
                } else {
                  const url = URL.createObjectURL(r);
                  window.open(url, '_blank');
                  this.cedulaIdentificasion = '';
                }
              });
          }
        }
      }, (err)=>{
        this.toastrService.error(
          'Usted no tiene certificado en este curso.',
          'CERTIFICADO NO ENCONTRADO'
        );
      });
  }

  placeholder = 'Seleccione su curso';
  updatePlaceholder(event: any) {
    const selectedOption = event.value;
    if (selectedOption) {
      this.placeholder = selectedOption.nombreCurso;
    } else {
      this.placeholder = 'Seleccione su curso';
    }
  }

  public idCursoG?: number = 0;
  public cedulaIdentificasion?: String = '';
  public capturarIDCurso(idCurso: number) {
    this.idCursoG = idCurso;
  }
}
