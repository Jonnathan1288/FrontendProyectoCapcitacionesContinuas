import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from 'src/app/models/asistencia';
import { Curso } from 'src/app/models/curso';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { CursoService } from 'src/app/service/curso.service';
import { NotasService } from 'src/app/service/notas.service';
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

  first = 0;
  layout: string = 'list';
  rows = 5;

  constructor(
    private participantesMatriculadosService: ParticipanteMatriculadoService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private cursosService: CursoService,
    private notasService: NotasService
  ) {}
  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idCursoRout = param['id'];
      this.idCursoMatricula = idCursoRout;
      this.traerParticipantesMatriculados(this.idCursoMatricula!);
      this.validarNotasFinales3Dias();
    });
  }

  curso: Curso = new Curso();
  isFalstanTresDias!: boolean;
  diasFaltantes!: any;
  fechaActual = new Date();
  public validarNotasFinales3Dias(): void {
    this.cursosService
      .getCursoById(this.idCursoMatricula!)
      .subscribe((data) => {
        this.curso = data;
        const fechaFin = new Date(this.curso.fechaFinalizacionCurso!);
        this.diasFaltantes =
          Math.round(
            Math.abs(
              (this.fechaActual.getTime() - fechaFin.getTime()) /
                (24 * 60 * 60 * 1000)
            )
          ) + 1;
        console.log(
          'Dias q termina >' + fechaFin + ' la actual ' + this.fechaActual
        );
        console.log('Dias restantes ->' + this.diasFaltantes);
        if (this.diasFaltantes <= 3) {
          this.isFalstanTresDias = true;
        } else {
          this.isFalstanTresDias = false;
        }
        this.validarExistenciaDeRegistros();
      });
  }

  isValidateExistenciaNotas!: boolean;
  public validarExistenciaDeRegistros(): void {
    this.notasService
      .validarExistenciaDatos(this.idCursoMatricula!)
      .subscribe((data) => {
        if (data == false) {
          // SI HAY DATOS
          this.isValidateExistenciaNotas = false;
        } else {
          // NO HAY DATOS
          this.isValidateExistenciaNotas = true;
        }
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
    this.router.navigate([
      '/asistencia/estudiantes/course',
      this.idCursoMatricula,
    ]);
  }

  public tomarNotasFinalesCurso() {
    this.router.navigate(['/notas/estudiantes/course', this.idCursoMatricula]);
  }

  //Control del modal para el registro de la informaicon visible
  //PARA EL MODAL

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  //IMPLEMENTACIÓN DE LA TABLA DE PRIMENG
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
    return this.listParticipantesMatriculados
      ? this.first === this.listParticipantesMatriculados.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.listParticipantesMatriculados ? this.first === 0 : true;
  }

  calcularEdad(fechaNacimiento: string): number {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const fechaActual = new Date();
    const diferenciaTiempo =
      fechaActual.getTime() - fechaNacimientoDate.getTime();
    const edad = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24 * 365.25));
    return edad;
  }
}
