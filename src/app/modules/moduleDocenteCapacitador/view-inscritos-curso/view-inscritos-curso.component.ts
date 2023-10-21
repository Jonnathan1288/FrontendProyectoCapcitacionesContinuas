import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Inscrito } from 'src/app/models/inscrito';
import { CursoService } from 'src/app/service/curso.service';
import { inscritosService } from 'src/app/service/inscritos.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { FOLDER_IMAGE_USER, getFile } from 'src/app/util/folder-upload';

@Component({
  selector: 'app-view-inscritos-curso',
  templateUrl: './view-inscritos-curso.component.html',
  styleUrls: ['./view-inscritos-curso.component.css'],
  providers: [ConfirmationService],
})
export class ViewInscritosCursoComponent implements OnInit {
  first = 0;
  layout: string = 'list';
  rows = 5;

  constructor(
    private activateRoute: ActivatedRoute,
    private cursoService: CursoService,
    private inscritosService: inscritosService,
    private router: Router,
    private participantesMatriculadosService: ParticipanteMatriculadoService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,
  ) { }

  idCursoGlobal?: number;

  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idCursoRout = param['id'];
      this.idCursoGlobal = idCursoRout;
      this.traerInscirtosPorCurso();
    });
  }

  public iniciarCursoCapacitacionContinua() {
    this.confirmationService.confirm({
      message: '¿Está seguro en iniciar el curso?',
      header: 'Una vez iniciado el curso, solo puede ver a sus estudiantes.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.InicioCurso();

      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastrService.error(
              'El inicio del curso cancelado.',
              'INIICI CANCELADO.',
              {
                timeOut: 2000,
              }
            );
            break;
          case ConfirmEventType.CANCEL:
            this.toastrService.warning(
              'Curso en espera para su inicio',
              'SALIR.',
              {
                timeOut: 2000,
              }
            );

            break;
        }
      },
    });
  }

  public inicioCursoEstado?: string;
  listaInscritos: Inscrito[] = [];
  participantesAceptado: number = 0;
  public traerInscirtosPorCurso(): void {
    this.inscritosService
      .getInscritosPorCurso(this.idCursoGlobal!)
      .subscribe((data) => {
        this.listaInscritos = data;
        this.validarCuposDisponibles();
        // VER CUANTOS ESTAN APROBADOS
        let contador = 0;
        for (let inscrito of this.listaInscritos) {
          if (inscrito.estadoInscrito === true) {
            contador++;
          }
        }
        this.participantesAceptado = contador;
        this.validarcursoCapacitacion(); // valida
        const primerEstadoCurso = this.listaInscritos.map(
          (inscrito) => inscrito.curso?.estadoPublicasionCurso
        );
        this.inicioCursoEstado = primerEstadoCurso[0] || '';
      });
  }

  // APROBAR O NO APROBAR INSCRITOS
  inscrito: Inscrito = new Inscrito();
  opcionSelecionada?: string;

  public aprobarParticipante(idInscrito: any): void {
    if (this.cuposDisponibles == 0) {
      // alert('no hya mas cupos');
      this.toastrService.success(
        'Lo sentimos los cupos fueron agotado.',
        'NO HAY MAS CUPOS.',
        {
          timeOut: 1200,
        }
      );
    } else {
      this.inscritosService
        .getInscrioParaCursoById(idInscrito)
        .subscribe((data) => {
          this.inscrito = data;
          this.inscrito.estadoInscrito = true;
          this.inscritosService
            .aprbarOdesaprobarInscrito(this.inscrito.idInscrito!, this.inscrito)
            .subscribe((dataTwo) => {
              // alert('se aprobo');
              this.toastrService.success(
                'Participante aprovado.',
                'APROVADO.',
                {
                  timeOut: 1200,
                }
              );
              this.traerInscirtosPorCurso();
            });
        });
    }
  }

  public NoAprobarParticipante(idInscrito: any): void {
    this.inscritosService
      .getInscrioParaCursoById(idInscrito)
      .subscribe((data) => {
        this.inscrito = data;
        this.inscrito.estadoInscrito = false;
        this.inscritosService
          .aprbarOdesaprobarInscrito(this.inscrito.idInscrito!, this.inscrito)
          .subscribe((dataTwo) => {
            // alert('no se aprobo');
            this.toastrService.warning(
              'Participante no aprovado',
              'NO APROVADO.',
              {
                timeOut: 1200,
              }
            );
            this.traerInscirtosPorCurso();
          });
      });
  }

  public estadoCurso?: string = '';
  public InicioCurso() {
    this.participantesMatriculadosService
      .pasarEstudiantesMatriculados(this.idCursoGlobal!)
      .subscribe(
        (data) => {
          this.router.navigate([
            '/verMatriculados/course/inicio',
            this.idCursoGlobal,
          ]);
        },
        (err) => {
          // alert('Curso iniciado no puede hacer mas acciones');
          this.router.navigate([
            '/verMatriculados/course/inicio',
            this.idCursoGlobal,
          ]);
        }
      );
  }

  public validarcursoCapacitacion() {
    // const fechasInicioCurso = this.listaInscritos.map((inscrito) => inscrito.curso?.fechaInicioCurso);

    const inscritoConFechaInicioCurso = this.listaInscritos.find(
      (inscrito) => inscrito.curso?.fechaInicioCurso
    );

    if (inscritoConFechaInicioCurso) {
      const fechaInicioCurso = new Date(inscritoConFechaInicioCurso.curso!.fechaInicioCurso!);
      const fecha = new Date();

      if (!isNaN(fechaInicioCurso.getTime())) {
        // Convertir las fechas en cadenas en formato ISO 8601
        const fechaInicioString = fechaInicioCurso.toISOString().split('T')[0];
        const fechaString = fecha.toISOString().split('T')[0];

        if (fechaString < fechaInicioString) {

          this.estadoCurso = 'FP';
        } else {

          this.estadoCurso = 'LI';
          // this.saveEvidenciasRegistrofotografico();
          // console.log('La fecha está dentro del rango válido');
        }
      } else {
        // Manejar el caso en el que fechaInicioCurso no sea un objeto Date válido
        this.toastrService.warning('La fecha de inicio de curso no es válida.');
      }
    } else {
      // Manejar el caso en el que no se encuentre un inscrito con fecha de inicio de curso
      this.toastrService.warning('No se encontró un inscrito con fecha de inicio de curso.');
    }


  }

  // VALIDACION DECUPOS DISPONIBLES
  curso: Curso = new Curso();
  cuposDisponibles!: number;
  mesajePantalla: String = 'Vacio';
  public validarCuposDisponibles(): void {
    this.cursoService.getCursoById(this.idCursoGlobal!).subscribe((data) => {
      this.curso = data;
      this.cuposDisponibles =
        this.curso.numeroCuposCurso! - this.participantesAceptado;
      this.mesajePantalla = 'Numero de Cupos: ' + this.cuposDisponibles;
      // VALIDACION
      if (this.participantesAceptado > this.cuposDisponibles) {

      } else {

      }
    });
  }

  //IMPLEMENTACIÓN DE NUEVOS METODOS
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
    return this.listaInscritos
      ? this.first === this.listaInscritos.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.listaInscritos ? this.first === 0 : true;
  }

  public getUriFile(fileName: string): string {
    return getFile(fileName, FOLDER_IMAGE_USER);
  }

}
