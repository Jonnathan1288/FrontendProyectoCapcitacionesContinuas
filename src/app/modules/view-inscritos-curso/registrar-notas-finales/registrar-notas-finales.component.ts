import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { InformeFinalCurso } from 'src/app/models/informe-final-curso';
import { Notas } from 'src/app/models/notas';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { CursoService } from 'src/app/service/curso.service';
import { InformeFinalCursoService } from 'src/app/service/informe-final-curso.service';
import { NotasService } from 'src/app/service/notas.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';

//other
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
@Component({
  selector: 'app-registrar-notas-finales',
  templateUrl: './registrar-notas-finales.component.html',
  styleUrls: ['./registrar-notas-finales.component.css'],
  providers: [ConfirmationService],
})
export class RegistrarNotasFinalesComponent implements OnInit {
  first = 0;
  layout: string = 'list';
  rows = 5;

  public classCursoFinalizaEstado = new Curso();

  public estadoFinal?: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private participantesMatriculadosService: ParticipanteMatriculadoService,
    private notasService: NotasService,
    private resportService: ReportsCapacitacionesService,
    private informeFinalCorseService: InformeFinalCursoService,
    private cursoService: CursoService,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService,
    private participantesAprovadosService: ParticipanteAprobadoService
  ) {}

  idCursoGlobal?: number;

  ngOnInit(): void {
    this.estadoFinal = localStorage.getItem('status')
    this.activateRoute.params.subscribe((param) => {
      const idCursoRout = param['id'];
      console.log('Idcurso => ' + idCursoRout);
      this.idCursoGlobal = idCursoRout;
      this.validarExistenciaDeRegistros();
      this.getCursoPorIdAlmacenado(idCursoRout);
      this.valida();
    });
  }

  // public ob

  public getCursoPorIdAlmacenado(idCurso: number) {
    this.cursoService.getCursoById(idCurso!).subscribe((data) => {
      if (data != null) {
        this.classCursoFinalizaEstado = data;
      }
    });
  }

  public finalizarCursoCapacitacionContinua() {
    this.confirmationService.confirm({
      message: 'Esta seguro en finalizar el curso?',
      header: 'Confirmación, una vez finalizado no podra hacer cambios.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        // alert()
        this.participantesAprovadosService
          .saveParticipantesAprobadosParacodigoSenecyt(this.idCursoGlobal!)
          .subscribe(
            (data) => {
              if (data != null) {
                this.toastrService.success(
                  'El curso a finalizado y sus datos han sido guardados.',
                  'CURSO FINALIZADO.',
                  {
                    timeOut: 2500,
                  }
                );

                this.router.navigate(['/capacitador/codigos/cenecyt']);
              }
              // alert(2)
            },
            (err) => {
              this.toastrService.error(
                'Intentalo más en la tarde.',
                'INCONVENIENTES.',
                {
                  timeOut: 1000,
                }
              );
            }
          );
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastrService.error(
              'Curso cancelado para su finalización.',
              'FINALIZAR CANCELADO.',
              {
                timeOut: 2000,
              }
            );
            break;
          case ConfirmEventType.CANCEL:
            this.toastrService.warning(
              'Curso en espera de finalización',
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

  isValidateExistenciaNotas!: boolean;
  public validarExistenciaDeRegistros(): void {
    this.notasService
      .validarExistenciaDatos(this.idCursoGlobal!)
      .subscribe((data) => {
        if (data == false) {
          // SI HAY DATOS
          // alert('si hay');
          this.isValidateExistenciaNotas = false;
          this.obtenerParticipantesFinales();
        } else {
          // NO HAY DATOS
          // alert('no hay');
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
      if (participante.estadoParticipanteActivo === true) {
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
    if (!this.notas.parcial || !this.notas.examenFinal) {
      this.toastrService.error(
        'Debe ingresar la nota examén final y además nota parcial.',
        'NOTAS VACIAS.',
        {
          timeOut: 2000,
        }
      );
    } else {
      this.notasService
        .updateNotas(this.idCapModelEdit!, this.notas)
        .subscribe((data) => {
          this.notas = data;
          this.obtenerParticipantesFinales();
          this.toastrService.success(
            'Nota ingresada del alumno correctamente.',
            'NOTAS INGRESADAS.',
            {
              timeOut: 2000,
            }
          );

          // alert('se registro la nota');
          this.visible = false;
        });
    }
  }
  //

  // VALIDAR LAS NOTAS FINALES
  // A:APROBADOS R:REPROBADOS X:RETIRADOS
  participantesMatriculado: ParticipantesMatriculados =
    new ParticipantesMatriculados();
  idParticpanteNota!: number;
  public vaidarNotasEstudiantesFinales(): void {
    let parcialCeroOVacio = false;
    let examenFinalCeroOVacio = false;

    this.listNotas.forEach((nota) => {
      if (nota.parcial === 0 || nota.parcial === undefined) {
        parcialCeroOVacio = true;
      }
      if (nota.examenFinal === 0 || nota.examenFinal === undefined) {
        examenFinalCeroOVacio = true;
      }
    });

    if (parcialCeroOVacio || examenFinalCeroOVacio) {
      this.toastrService.error(
        'Debe ingresar todas las notas de los estudiantes, y no deben ser cero.',
        'NOTAS INCOMPLETAS'
      );
      return;
    }
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

    this.toastrService.success(
      'Las notas se encuentran validadas.',
      'NOTAS VALIDADAS.',
      {
        timeOut: 2000,
      }
    );
  }

  public validarNotasFinalesView(nota1: number, notafinal: number) {
    return nota1 * 0.4 + notafinal * 0.6;
  }

  public generarReporteAsitenciaEvaluacion(): void {
    this.resportService
      .downloadAsistenciaEvaluacion(this.idCursoGlobal!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  public generarReporteParticipantes(): void {
    this.resportService
      .downloadInformeFinalParticipantesCurso(this.idCursoGlobal!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  //INFORME FINAL
  public generarReporteInformeFinalCurso(): void {
    this.resportService
      .downloadInformeFinalCurso(this.idCursoGlobal!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  //IMPLEMENTACION PARA QUE LLENE EL FORMULARIO FINAL DE CURSO..

  visibleModalFormFinalCourse?: boolean = false;

  // EDIT AND CREATE RESULTADOS //
  public classInformeFinalC = new InformeFinalCurso();

  public showModalFinalInformationCorse() {
    // this.informeFinalCorseService
    //   .getInformeFinalCursoByIdCurso(this.idCursoGlobal!)
    //   .subscribe(
    //     (data) => {
    //       if (data != null) {
    //         this.classInformeFinalC = data;
    //         this.classInformeFinalC.idInformeFinalCurso =
    //           data.idInformeFinalCurso;
    //       }
    //     },
    //     (err) => {
    //       this.toastrService.info(
    //         'Listo para llenar el informe final.',
    //         'INFORME FINAL.',
    //         {
    //           timeOut: 2000,
    //         }
    //       );
    //     }
    //   );
    this.visibleModalFormFinalCourse = true;
  }

  public traerInformeFinalCurso() {
    this.informeFinalCorseService
      .getInformeFinalCursoByIdCurso(this.idCursoGlobal!)
      .subscribe(
        (data) => {
          if (data != null) {
            this.classInformeFinalC = data;
            this.classInformeFinalC.idInformeFinalCurso =
              data.idInformeFinalCurso;
          }
        },
        (err) => {
          this.toastrService.info(
            'Listo para llenar el informe final.',
            'INFORME FINAL.',
            {
              timeOut: 2000,
            }
          );
        }
      );
  }

  public valida() {
    this.informeFinalCorseService
      .getInformeFinalCursoByIdCurso(this.idCursoGlobal!)
      .subscribe(
        (data) => {
          if (data != null) {
            this.classInformeFinalC = data;
            this.classInformeFinalC.idInformeFinalCurso =
              data.idInformeFinalCurso;
          }
        },
        (err) => {
          this.toastrService.info(
            'Listo para llenar el informe final.',
            'INFORME FINAL.',
            {
              timeOut: 2000,
            }
          );
        }
      );
  }

  public validarCamposVaciosInformeFinal() {
    if (
      !this.classInformeFinalC.observacionesInformeFinalCurso ||
      !this.classInformeFinalC.lugarInformeFinalCurso ||
      !this.classInformeFinalC.nombreCantonInformeFinalCurso
    ) {
      this.toastrService.error(
        'Debe llenar todos los campos.',
        'CAMPOS VACÍOS.',
        {
          timeOut: 2000,
        }
      );
    } else {
      this.saveUpdateInformFinalCourse();
    }
  }

  public saveUpdateInformFinalCourse() {
    this.classInformeFinalC = { ...this.classInformeFinalC };
    if (this.classInformeFinalC.idInformeFinalCurso) {
      this.informeFinalCorseService
        .updateInformeFinalCurso(
          this.classInformeFinalC.idInformeFinalCurso,
          this.classInformeFinalC
        )
        .subscribe((data) => {
          if (data != null) {
            this.toastrService.success(
              'Datos del informe final actualizados.',
              'DATOS ACTUALIZADOS.',
              {
                timeOut: 2000,
              }
            );
            location.reload();
            // alert('succesful update');
            this.visibleModalFormFinalCourse = false;
          }
        });
    } else {
      this.classInformeFinalC.curso = this.classCursoFinalizaEstado;
      // this.classInformeFinalC.curso = data;
      this.informeFinalCorseService
        .saveInformeFinalCurso(this.classInformeFinalC)
        .subscribe((data) => {
          if (data != null) {
            // alert('succesful');
            this.toastrService.success(
              'Datos del informe final almacenados correctamente.',
              'INFORME CREADO.',
              {
                timeOut: 2000,
              }
            );
            location.reload();
            console.log({ cf: data });
          }
        });
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

  lastValidParcial: string = ''; // Variable para almacenar el último valor válido del campo

  public validarParcialAndFinalNota(event: any) {
    const valor = event.target.value;

    if (valor === '0') {
      event.target.value = ''; // Si el valor ingresado es "0", se elimina el contenido del campo
      return;
    }

    if (valor && (isNaN(valor) || valor < 0 || valor > 10)) {
      event.target.value = this.lastValidParcial;
    } else {
      this.lastValidParcial = valor;
    }
  }

  validarEntrada(event: any): void {
    const tecla = event.keyCode || event.which;
    const valor = event.target.value;
  
    if (valor === '0' && (tecla === 48 || tecla === 96)) {
      event.preventDefault(); // Evita la entrada de "0" si ya se ingresó en el campo
    }
  }
}
