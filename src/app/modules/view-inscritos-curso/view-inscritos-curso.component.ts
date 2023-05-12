import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Inscrito } from 'src/app/models/inscrito';
import { Persona } from 'src/app/models/persona';
import { Usuario } from 'src/app/models/usuario';
import { CursoService } from 'src/app/service/curso.service';
import { inscritosService } from 'src/app/service/inscritos.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-view-inscritos-curso',
  templateUrl: './view-inscritos-curso.component.html',
  styleUrls: ['./view-inscritos-curso.component.css'],
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
    private us:UsuarioService
  ) {}

  idCursoGlobal?: number;



  ngOnInit(): void {
    this.activateRoute.params.subscribe((param) => {
      const idCursoRout = param['id'];
      console.log('Idcurso => ' + idCursoRout);
      this.idCursoGlobal = idCursoRout;
      this.traerInscirtosPorCurso();
    });
  }

  public inicioCursoEstado?: string;
  listaInscritos: Inscrito[] = [];
  participantesAceptado:number = 0;
  public traerInscirtosPorCurso(): void {
    this.inscritosService
      .getInscritosPorCurso(this.idCursoGlobal!)
      .subscribe((data) => {
        this.listaInscritos = data;
        console.log('dd ' + this.listaInscritos);
        
        this.validarCuposDisponibles();
        // VER CUANTOS ESTAN APROBADOS
        let contador = 0
        for (let inscrito of this.listaInscritos ) {
          if (inscrito.estadoInscrito === true) {
            contador ++;
          }
        }
        console.log("Número de inscritos en true -> " + contador);
        this.participantesAceptado = contador;  
        
        this.validarcursoCapacitacion() // valida
        const  primerEstadoCurso = this.listaInscritos.map((inscrito) => inscrito.curso?.estadoPublicasionCurso);
        this.inicioCursoEstado = primerEstadoCurso[0] || '';
        console.log("hola ->" + this.inicioCursoEstado)

      });
  }

  // APROBAR O NO APROBAR INSCRITOS
  inscrito: Inscrito = new Inscrito();
  opcionSelecionada?: string;

  public aprobarParticipante(idInscrito: any): void {

    if (this.cuposDisponibles == 0) {
      alert("no hya mas cupos")
    } else {
      this.inscritosService
      .getInscrioParaCursoById(idInscrito)
      .subscribe((data) => {
        this.inscrito = data;
        this.inscrito.estadoInscrito = true;
        this.inscritosService
          .aprbarOdesaprobarInscrito(this.inscrito.idInscrito!, this.inscrito)
          .subscribe((dataTwo) => {
            alert('se aprobo');
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
            alert('no se aprobo');
            this.traerInscirtosPorCurso();
          });
      });
  }

  public estadoCurso?: string='';
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
        alert('Curso iniciado no puede hacer mas acciones');
        this.router.navigate([
          '/verMatriculados/course/inicio',
          this.idCursoGlobal,
        ]);
      }
    );  
  }

  public validarcursoCapacitacion(){
    // const fechasInicioCurso = this.listaInscritos.map((inscrito) => inscrito.curso?.fechaInicioCurso);

    const fechaInicioCurso = this.listaInscritos.find(
      (inscrito) => inscrito.curso?.fechaInicioCurso
    )?.curso?.fechaInicioCurso;

    if (fechaInicioCurso) {
      const fechaInicioAdjusted = new Date(fechaInicioCurso);
      fechaInicioAdjusted.setDate(fechaInicioAdjusted.getDate() + 1);

      const fechaActual = new Date();

      if (
        fechaActual.getFullYear() === fechaInicioAdjusted.getFullYear() &&
        fechaActual.getMonth() === fechaInicioAdjusted.getMonth() &&
        fechaActual.getDate() === fechaInicioAdjusted.getDate()
      ) {
        this.estadoCurso = 'LI';
        console.log('Las fechas son iguales');

        //Fecha donde de habilita
      } else if (fechaActual > fechaInicioAdjusted) {
        this.estadoCurso = 'IN';
        console.log('La fecha actual es posterior a la fecha de inicio');
      } else {
        this.estadoCurso = 'FP';
        console.log('La fecha actual es anterior a la fecha de inicio');
      }
    }
  }

  // VALIDACION DECUPOS DISPONIBLES
  curso: Curso = new Curso();
  cuposDisponibles!:number;
  mesajePantalla:String = "Vacio";
  public validarCuposDisponibles():void{
    this.cursoService.getCursoById(this.idCursoGlobal!).subscribe(
      data=>{
        this.curso = data;
        this.cuposDisponibles =  this.curso.numeroCuposCurso! - this.participantesAceptado;
        console.log("Numero de cupos -> " + this.cuposDisponibles);
        this.mesajePantalla = "Numero de Cupos: " + this.cuposDisponibles;
        //
        console.log("Los que estan aceptado ->" + this.participantesAceptado)
        // VALIDACION
        if (this.participantesAceptado > this.cuposDisponibles) {
          console.log("no hay mas cupos")
        } else {
          console.log("si hay cupos")
        }
      }
    )
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

}
