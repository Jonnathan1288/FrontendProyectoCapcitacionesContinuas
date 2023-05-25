import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencia } from 'src/app/models/asistencia';
import { AsistenciaService } from 'src/app/service/asistencia.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';

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


  first = 0;
  layout: string = 'list';
  rows = 5;

  public estadoFinal?: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private asistenciaService: AsistenciaService,
    private toastrService: ToastrService,
    private participanteMatriculadoService: ParticipanteMatriculadoService
  ) {}
  ngOnInit(): void {
    this.estadoFinal = localStorage.getItem('status')
    this.activateRoute.params.subscribe((param) => {
      const idEstudiantesM = param['id'];
      this.idCursoEstudiantesMatriculados = idEstudiantesM;
      this.traerListadoEstudiantesMatriculadosAsistencia(
        this.idCursoEstudiantesMatriculados!
      );
    });
  }

  public traerListadoEstudiantesMatriculadosAsistencia(idCurso: number) {
    this.asistenciaService
      .generarAsistenciaPorFecha(idCurso)
      .subscribe((data) => {
        if (data != null) {
          this.listaAsistenciaE = data;
          this.listAsistenciasAntiguas = this.listaAsistenciaE
          this.banderaParaControlAsistencia = true;

        }

      });
  }



  public tomarAsistenciaCursoEstudiante(idAsist: any, asistencia: Asistencia) {
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

  public tomarAsistenciaCursoEstudianteCP() {
    this.asistenciaService
      .updateAsistencia(
        this.asistenciaEstudiante.idAsistencia!,
        this.asistenciaEstudiante
      )
      .subscribe((data) => {
        if (data != null) {
          if(this.fechaAlmacenada === undefined || this.fechaAlmacenada === null){
            this.toastrService.success(
              'Observación realizada con éxito',
              'OBSERVACIÓN GUARDADA.'
            );
            this.traerListadoEstudiantesMatriculadosAsistencia(this.idCursoEstudiantesMatriculados!);
          }else{
            this.asistenciaService
            .getAsistenciaAntiguasPorFecha(
              this.idCursoEstudiantesMatriculados!,
              this.fechaAlmacenada!
            )
            .subscribe((data) => {
              if (data != null) {
                console.log(data)
                this.listAsistenciasAntiguas = data
              }
            })
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

  public listAsistenciasAntiguas : Asistencia[]=[]
  public fechaAlmacenada ?: string;
  public onDateSelect(event: any) {
    const selectedDate: Date = event;

    const formattedDate = selectedDate.toISOString().substring(0, 10); // Obtener la fecha en formato 'yyyy-MM-dd'
    console.log(formattedDate)
    this.fechaAlmacenada = formattedDate
    this.asistenciaService
      .getAsistenciaAntiguasPorFecha(
        this.idCursoEstudiantesMatriculados!,
        formattedDate
      )
      .subscribe((data) => {
        if (data != null) {
          console.log(data)
         
          if(data.length > 0){
            this.toastrService.success(
              'Historial de asistencia encontrada.',
              'ASISTENCIA RECUPERADA.'
            );

            this.listAsistenciasAntiguas = data;
          }else{
            this.toastrService.error(
              'La fecha ingresada no coincide con el curso.',
              'ASISTENCIA NO ENCONTRADA.'
            );
            this.listAsistenciasAntiguas = data;
      
          }

        }
      }, (err)=>{
        this.listAsistenciasAntiguas = [];
        console.log(err)
      });
  }



  //Eliminado logico del sistema
  public eliminadoLogicoDelCapacitador(participantesMatriculados: ParticipantesMatriculados) {
    // capacitador.estadoActivoCapacitador = false;

    participantesMatriculados.estadoParticipanteActivo = !participantesMatriculados.estadoParticipanteActivo; // Alternar el estado activo/desactivado

    if(participantesMatriculados.estadoParticipanteActivo == true){
      participantesMatriculados.estadoParticipanteAprobacion = 'P'
    }else{
      participantesMatriculados.estadoParticipanteAprobacion = 'X'
    }
    this.participanteMatriculadoService
      .updateParticipantesMatriculados(participantesMatriculados.idParticipanteMatriculado!, participantesMatriculados)
      .subscribe((data) => {
        if (data != null) {
          if (participantesMatriculados.estadoParticipanteActivo) {
            this.toastrService.success('Estudiante activo', 'ASISTE');
          } else {
            this.toastrService.warning('Estudiante a sido almacenado como retirado', 'ESTUDIANTE RETIRADO');
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
