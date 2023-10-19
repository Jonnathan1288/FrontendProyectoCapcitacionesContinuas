
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from 'src/app/models/asistencia';
import { AsistenciaService } from 'src/app/service/asistencia.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';

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

  public banderaParaControlAsistencia: boolean = false;
  //el array de los estudiantes del curso matriculado
  public listaAsistenciaE: any[] = [];

  public curso = new Curso();

  first = 0;
  layout: string = 'list';
  rows = 5;

  public estadoFinal?: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private asistenciaService: AsistenciaService,
    private toastrService: ToastrService,
    private participanteMatriculadoService: ParticipanteMatriculadoService,
    private cursoService: CursoService
  ) {}
  ngOnInit(): void {
    this.estadoFinal = localStorage.getItem('status');
    this.activateRoute.params.subscribe((param) => {
      const idEstudiantesM = param['id'];
      this.idCursoEstudiantesMatriculados = idEstudiantesM;
      //this.traerListadoEstudiantesMatriculadosAsistencia(
       // this.idCursoEstudiantesMatriculados!
     // );
    });
    this.getCurso();
  }

  public traerListadoEstudiantesMatriculadosAsistencia(idCurso: number) {
    this.asistenciaService
      .generarAsistenciaPorFecha(idCurso)
      .subscribe((data) => {
        if (data != null) {
          this.listaAsistenciaE = data;
          this.listAsistenciasAntiguas = this.listaAsistenciaE;
          this.banderaParaControlAsistencia = true;
        }
      });
  }

  public tomarAsistenciaCursoEstudianteCP() {
    this.asistenciaService
      .updateAsistencia(
        this.asistenciaEstudiante.idAsistencia!,
        this.asistenciaEstudiante
      )
      .subscribe((data) => {
        if (data != null) {
          if (
            this.fechaAlmacenada === undefined ||
            this.fechaAlmacenada === null
          ) {
            this.toastrService.success(
              'Observación realizada con éxito',
              'OBSERVACIÓN GUARDADA.'
            );
            this.traerListadoEstudiantesMatriculadosAsistencia(
              this.idCursoEstudiantesMatriculados!
            );
          } else {
            this.asistenciaService
              .getAsistenciaAntiguasPorFecha(
                this.idCursoEstudiantesMatriculados!,
                this.fechaAlmacenada!
              )
              .subscribe((data) => {
                if (data != null) {
                  console.log(data);
                  this.listAsistenciasAntiguas = data;
                }
              });
          }
        }
      });
    this.visible = false;
  }

  public estudianteAsisteClase(idAsist: any, asistencia: Asistencia): void {
    asistencia.estadoAsistencia = true;
    this.asistenciaService
      .updateAsistencia(idAsist, asistencia)
      .subscribe((data) => {
        if (data != null) {
          console.log(data);

          this.toastrService.success(
            'Estudiante tomado asistencia',
            'TOMADO ASISTENCIA.'
          );
        }
      });
  }

  public estudianteNOAsisteAClase(idAsist: any, asistencia: Asistencia): void {
    asistencia.estadoAsistencia = false;
    this.asistenciaService
      .updateAsistencia(idAsist, asistencia)
      .subscribe((data) => {
        if (data != null) {
          console.log(data);

          this.toastrService.error(
            'Estudiante no asiste a clases.',
            'NO ASISTE.'
          );
        }
      });
  }

  visible: boolean = false;

  showDialog(asistencia: Asistencia) {
    this.asistenciaEstudiante = { ...asistencia };
    this.visible = true;
  }

  public listAsistenciasAntiguas: Asistencia[] = [];

  public fechaAlmacenada?: string;

  public onDateSelect(event: any) {
    const selectedDate: Date = event;

    const formattedDate = selectedDate.toISOString().substring(0, 10); // Obtener la fecha en formato 'yyyy-MM-dd'

    const diaSemana = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    const isDiaPermitido = this.isDiaPermitido(diaSemana);

    if (!isDiaPermitido) {
      this.toastrService.error(
        'El día seleccionado no está permitido en el horario del curso.',
        'DÍA NO PERMITIDO'
      );
      this.listAsistenciasAntiguas = [];
      return;
    }
    // Compara las fechas formateadas

    if (this.curso.fechaFinalizacionCurso && this.curso.fechaInicioCurso) {
      this.curso.fechaInicioCurso = new Date(this.curso.fechaInicioCurso);
      this.curso.fechaFinalizacionCurso = new Date(this.curso.fechaFinalizacionCurso);

      const fechaInicioCurso = new Date(this.curso.fechaInicioCurso.getUTCFullYear(),this.curso.fechaInicioCurso.getUTCMonth(),this.curso.fechaInicioCurso.getUTCDate());
      const fechaFinCurso = new Date(this.curso.fechaFinalizacionCurso.getUTCFullYear(),this.curso.fechaFinalizacionCurso.getUTCMonth(),this.curso.fechaFinalizacionCurso.getUTCDate());

      if (selectedDate >= fechaInicioCurso && selectedDate <= fechaFinCurso) {
        this.asistenciaService
          .getAsistenciaAntiguasPorFecha(
            this.idCursoEstudiantesMatriculados!,
            formattedDate
          )
          .subscribe(
            (data) => {
              if (data != null) {
                console.log(data);

                if (data.length > 0) {
                  this.toastrService.success(
                    'Historial de asistencia encontrada.',
                    'ASISTENCIA RECUPERADA.'
                  );
                  this.listAsistenciasAntiguas = data;
                } else {
                  this.toastrService.error(
                    'En la fecha ingresada no se tomó asistencia!',
                    'ASISTENCIA NO REGISTRADA EN ESA FECHA!'
                  );
                  this.listAsistenciasAntiguas = data;
                  this.asistenciaService
                    .generarAsistenciaPorFecha2(
                      this.idCursoEstudiantesMatriculados!,
                      formattedDate
                    )
                    .subscribe((data) => {
                      if (data != null) {
                        this.listaAsistenciaE = data;
                        this.listAsistenciasAntiguas = this.listaAsistenciaE;
                        this.banderaParaControlAsistencia = true;
                      }
                    });
                }
              }
            },
            (err) => {
              this.listAsistenciasAntiguas = [];
              console.log(err);
            }
          );
      } else {
        this.toastrService.error(
          'Esta fuera del rango de la fecha de inicio o fin del curso.',
          'FUERA DE RANGO'
        );
        console.log(this.curso.fechaInicioCurso);
        this.listAsistenciasAntiguas = [];
      }
    } else {
      this.toastrService.success(
        'Fecha de curso no definida',
        'ERROR DE FECHAS'
      );
      console.log(this.curso.fechaInicioCurso);
      this.listAsistenciasAntiguas = [];
    }
  }

  public isDiaPermitido(dia: string): boolean {
    //determinar si el día está en el rango permitido
    if (this.curso.horarioCurso?.dias === 'Lunes-Viernes') {
      return dia !== 'Saturday' && dia !== 'Sunday';
    } else if (this.curso.horarioCurso?.dias === 'Sábados') {
      return dia === 'Saturday';
    } else if (this.curso.horarioCurso?.dias === 'Domingos') {
      return dia === 'Sunday';
    }else if(this.curso.horarioCurso?.dias === 'Lunes-Domingo'){
      return true;
    }
    return true;
  }

  public getCurso() {
    this.cursoService
      .getCursoById(this.idCursoEstudiantesMatriculados!)
      .subscribe(
        (data: Curso) => {
          this.curso = data;
        },
        (error) => {
          console.error('Error al obtener el curso:', error);
        }
      );
  }

  //Eliminado logico del sistema
  public eliminadoLogicoDelCapacitador(
    participantesMatriculados: ParticipantesMatriculados
  ) {
    // capacitador.estadoActivoCapacitador = false;

    participantesMatriculados.estadoParticipanteActivo =
      !participantesMatriculados.estadoParticipanteActivo; // Alternar el estado activo/desactivado

    if (participantesMatriculados.estadoParticipanteActivo == true) {
      participantesMatriculados.estadoParticipanteAprobacion = 'P';
    } else {
      participantesMatriculados.estadoParticipanteAprobacion = 'X';
    }
    this.participanteMatriculadoService
      .updateParticipantesMatriculados(
        participantesMatriculados.idParticipanteMatriculado!,
        participantesMatriculados
      )
      .subscribe((data) => {
        if (data != null) {
          if (participantesMatriculados.estadoParticipanteActivo) {
            this.toastrService.success('Estudiante activo', 'ASISTE');
          } else {
            this.toastrService.warning(
              'Estudiante a sido almacenado como retirado',
              'ESTUDIANTE RETIRADO'
            );
          }
          //this.listDocentesCapacitadores();
        }
      });
  }

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
    return this.listAsistenciasAntiguas
      ? this.first === this.listAsistenciasAntiguas.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.listAsistenciasAntiguas ? this.first === 0 : true;
  }
}