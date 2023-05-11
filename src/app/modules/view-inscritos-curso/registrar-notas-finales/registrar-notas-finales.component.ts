import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { InformeFinalCurso } from 'src/app/models/informe-final-curso';
import { Notas } from 'src/app/models/notas';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { CursoService } from 'src/app/service/curso.service';
import { InformeFinalCursoService } from 'src/app/service/informe-final-curso.service';
import { NotasService } from 'src/app/service/notas.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';

@Component({
  selector: 'app-registrar-notas-finales',
  templateUrl: './registrar-notas-finales.component.html',
  styleUrls: ['./registrar-notas-finales.component.css'],
})
export class RegistrarNotasFinalesComponent implements OnInit {

  first = 0;
  layout: string = 'list';
  rows = 5;


  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private participantesMatriculadosService: ParticipanteMatriculadoService,
    private notasService: NotasService,
    private resportService: ReportsCapacitacionesService,
    private informeFinalCorseService: InformeFinalCursoService,
    private cursoService: CursoService
  ) {}

  idCursoGlobal?: number;

  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idCursoRout = param['id'];
      console.log('Idcurso => ' + idCursoRout);
      this.idCursoGlobal = idCursoRout;
      this.validarExistenciaDeRegistros();
    });
  }

  isValidateExistenciaNotas!: boolean;
  public validarExistenciaDeRegistros(): void {
    this.notasService
      .validarExistenciaDatos(this.idCursoGlobal!)
      .subscribe((data) => {
        if (data == false) {
          // SI HAY DATOS
          alert('si hay');
          this.isValidateExistenciaNotas = false;
          this.obtenerParticipantesFinales();
        } else {
          // NO HAY DATOS
          alert('no hay');
          this.isValidateExistenciaNotas = true;
          this.traerParticipantesMatriculados();
        }
      });
  }

  listaParticipantesMatriculados: ParticipantesMatriculados[] = [];
  // TRAER TODOS LOS MATRICULADOS DEL CURSO //
  public traerParticipantesMatriculados(): void {
    this.participantesMatriculadosService
      .getParticipantesMatriculadosByIdCurso(this.idCursoGlobal!)
      .subscribe((data) => {
        this.listaParticipantesMatriculados = data;
        console.log('trayendo -> ' + this.listaParticipantesMatriculados);
        this.guardarDatosVacios();
      });
  }
  // FIN //
  notas: Notas = new Notas();
  // MANDAR LOS DATOS A LA TABLA
  public guardarDatosVacios(): void {
    for (let participante of this.listaParticipantesMatriculados) {
      const notas = new Notas();
      notas.partipantesMatriculados = participante;
      notas.examenFinal = 0;
      notas.observacion = '';
      notas.parcial = 0;
      this.notasService.saveNotas(notas).subscribe((data) => {
        alert('se registró el participante ');
        this.obtenerParticipantesFinales();
      });
    }
  }
  //

  // TAER TODOS LOS ESTUDIANTES YA GUARDADOS
  listNotas: Notas[] = [];

  public obtenerParticipantesFinales(): void {
    this.notasService
      .getParticipantesFinales(this.idCursoGlobal!)
      .subscribe((data) => {
        this.listNotas = data;
      });
  }

  // CREAR NOTAS POR ESTUDIANTE

  /* MODAL */
  visible?: boolean;
  idCapModelEdit?: number;

  // EDIT AND CREATE RESULTADOS //
  public showModalNotas(idParticpanteNota: number) {
    this.visible = true;
    this.notasService.getNotasById(idParticpanteNota).subscribe((data) => {
      this.notas = data;
      this.idCapModelEdit = this.notas.idNota;
    });
  }

  public guardarNotaPorEstudiante(): void {
    this.notasService
      .updateNotas(this.idCapModelEdit!, this.notas)
      .subscribe((data) => {
        this.notas = data;
        this.obtenerParticipantesFinales();
        alert('se registro la nota');
        this.visible = false;
      });
  }
  //

  // VALIDAR LAS NOTAS FINALES
  // A:APROBADOS R:REPROBADOS X:RETIRADOS
  participantesMatriculado: ParticipantesMatriculados =
    new ParticipantesMatriculados();
  idParticpanteNota!: number;
  public vaidarNotasEstudiantesFinales(): void {
    console.log('CLICk');
    for (let participante of this.listNotas) {
      const parcial = participante.parcial!;
      const examen = participante.examenFinal!;
      this.idParticpanteNota =
        participante.partipantesMatriculados!.idParticipanteMatriculado!;
      const notaFinal = parcial * 0.4 + examen * 0.6;
      console.log(' Esta es su nota final -> ' + notaFinal);

      this.participantesMatriculadosService
        .getParticipantesMatriculadosById(this.idParticpanteNota)
        .subscribe((data) => {
          this.participantesMatriculado = data;
          if (notaFinal >= 7) {
            console.log('APROBADO');
            this.participantesMatriculado.estadoParticipanteAprobacion = 'A';
          } else {
            console.log('NO APROBADO');
            this.participantesMatriculado.estadoParticipanteAprobacion = 'R';
          }
          this.participantesMatriculadosService
            .updateParticipantesMatriculados(
              this.idParticpanteNota,
              this.participantesMatriculado
            )
            .subscribe((data) => {
              console.log('Se actulizo su estado APROBACION');
            });
        });
    }
  }

  public generarReporteAsitenciaEvaluacion(): void {
    this.resportService
      .downloadAsistenciaEvaluacion(this.idCursoGlobal!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  //IMPLEMENTACION PARA QUE LLENE EL FORMULARIO FINAL DE CURSO..

  visibleModalFormFinalCourse?: boolean= false;

  // EDIT AND CREATE RESULTADOS //
  public classInformeFinalC = new InformeFinalCurso();

  public showModalFinalInformationCorse() {
    this.informeFinalCorseService
      .getInformeFinalCursoByIdCurso(this.idCursoGlobal!)
      .subscribe(
        (data) => {
          if (data != null) {
            this.classInformeFinalC = data;
            this.classInformeFinalC.idInformeFinalCurso = data.idInformeFinalCurso
          }
        },
        (err) => {
          alert('ee');
        }
      );
    this.visibleModalFormFinalCourse = true;
  }

  public saveUpdateInformFinalCourse() {
    this.classInformeFinalC = { ...this.classInformeFinalC };
    if (this.classInformeFinalC.idInformeFinalCurso) {
      
      this.informeFinalCorseService.updateInformeFinalCurso(this.classInformeFinalC.idInformeFinalCurso, this.classInformeFinalC).subscribe((data)=>{
        if(data != null){
          alert('succesful update')
          this.visibleModalFormFinalCourse = false;
        }
      })
    } else {
      this.cursoService.getCursoById(this.idCursoGlobal!).subscribe(
        (data) => {
          if (data != null) {
            this.classInformeFinalC.curso = data;
            this.informeFinalCorseService
              .saveInformeFinalCurso(this.classInformeFinalC)
              .subscribe((data) => {
                if (data != null) {
                  alert('succesful');
                  console.log({ cf: data });
                }
              });
          }
        },
        (err) => {
          alert('exption' + err);
        }
      );
    }
  }


  //implemeentacion
  
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
      return this.listNotas
        ? this.first === this.listNotas.length - this.rows
        : true;
    }
  
    isFirstPage(): boolean {
      return this.listNotas ? this.first === 0 : true;
    }
}
