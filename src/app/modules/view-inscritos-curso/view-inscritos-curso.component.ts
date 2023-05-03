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
  styleUrls: ['./view-inscritos-curso.component.css']
})
export class ViewInscritosCursoComponent implements OnInit {

  constructor(
    private activateRoute: ActivatedRoute,
    private cursoService: CursoService,
    private inscritosService: inscritosService,
    private router: Router,
    private participantesMatriculadosService: ParticipanteMatriculadoService
  ) {
  }

  idCursoGlobal?: number;

  ngOnInit(): void {
    this.activateRoute.params.subscribe( (param) =>{
      const idCursoRout = param['id'];
      console.log("Idcurso => " + idCursoRout)
      this.idCursoGlobal = idCursoRout;
      this.traerInscirtosPorCurso();
    });
  }

  
  listaInscritos: Inscrito[] = [];
  public traerInscirtosPorCurso():void{
    this.inscritosService.getInscritosPorCurso(this.idCursoGlobal!).subscribe(
      data =>{
        this.listaInscritos = data;
        console.log("dd " + this.listaInscritos)
      }
    )
  }

  // APROBAR O NO APROBAR INSCRITOS
  inscrito: Inscrito = new Inscrito();
  opcionSelecionada?: string;

  public aprobarParticipante(idInscrito:any):void{
    this.inscritosService.getInscrioParaCursoById(idInscrito).subscribe(
      data=>{
        this.inscrito = data;
        this.inscrito.estadoInscrito = true;
        this.inscritosService.aprbarOdesaprobarInscrito(this.inscrito.idInscrito!,this.inscrito).subscribe(
          dataTwo =>{
            alert("se aprobo")
            this.traerInscirtosPorCurso();
          }
        )
      }
    )
  }

  public NoAprobarParticipante(idInscrito:any):void{
    this.inscritosService.getInscrioParaCursoById(idInscrito).subscribe(
      data=>{
        this.inscrito = data;
        this.inscrito.estadoInscrito = false;
        this.inscritosService.aprbarOdesaprobarInscrito(this.inscrito.idInscrito!,this.inscrito).subscribe(
          dataTwo =>{
            alert("no se aprobo")
            this.traerInscirtosPorCurso();
          }
        )
      }
    )
  }

  public InicioCurso() {
    this.participantesMatriculadosService.pasarEstudiantesMatriculados(this.idCursoGlobal!).subscribe((data)=>{
      this.router.navigate(['/verMatriculados/course/inicio', this.idCursoGlobal]);
    })
    
    
  }


}
