import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Inscrito } from 'src/app/models/inscrito';
import { CursoService } from 'src/app/service/curso.service';
import { inscritosService } from 'src/app/service/inscritos.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';

@Component({
  selector: 'app-view-inscritos-curso',
  templateUrl: './view-inscritos-curso.component.html',
  styleUrls: ['./view-inscritos-curso.component.css'],
})
export class ViewInscritosCursoComponent implements OnInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private cursoService: CursoService,
    private inscritosService: inscritosService,
    private router: Router,
    private participantesMatriculadosService: ParticipanteMatriculadoService
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

  public InicioCurso() {
    this.participantesMatriculadosService
      .pasarEstudiantesMatriculados(this.idCursoGlobal!)
      .subscribe((data) => {
        this.router.navigate([
          '/verMatriculados/course/inicio',
          this.idCursoGlobal,
        ]);
      }, (err)=>{
        alert('Curso iniciado no puede hacer mas acciones')
        this.router.navigate([
          '/verMatriculados/course/inicio',
          this.idCursoGlobal,
        ]);
      });
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
          alert("NO HAY MAS CUPOS")
        } else {
          console.log("si hay cupos")
        }
      }
    )
  }


}
