import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notas } from 'src/app/models/notas';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { CursoService } from 'src/app/service/curso.service';
import { NotasService } from 'src/app/service/notas.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';

@Component({
  selector: 'app-registrar-notas-finales',
  templateUrl: './registrar-notas-finales.component.html',
  styleUrls: ['./registrar-notas-finales.component.css']
})
export class RegistrarNotasFinalesComponent implements OnInit{

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private participantesMatriculadosService: ParticipanteMatriculadoService,
    private notasService: NotasService
  ) {}

  idCursoGlobal?: number;

  ngOnInit(): void {
    this.activateRoute.params.subscribe( (param) =>{
      const idCursoRout = param['id'];
      console.log("Idcurso => " + idCursoRout)
      this.idCursoGlobal = idCursoRout;
      // this.obtenerParticipantesFinales();
      this.traerParticipantesMatriculados();
    });
  }

  listaParticipantesMatriculados: ParticipantesMatriculados [] = [];
  // TRAER TODOS LOS MATRICULADOS DEL CURSO //
  public traerParticipantesMatriculados():void{
    this.participantesMatriculadosService.getParticipantesMatriculadosByIdCurso(this.idCursoGlobal!).subscribe(
      data => {
        this.listaParticipantesMatriculados = data;
      }
    )
  }
  // FIN //
  notas: Notas = new Notas();
  // MANDAR LOS DATOS A LA TABLA
  public guardarDatosVacios():void{
    for (let participante of this.listaParticipantesMatriculados) {
      const notas = new Notas();
      notas.partipantesMatriculados = participante;
      notas.examenFinal = 0;
      notas.observacion = "";
      notas.parcial = 0;
      this.notasService.saveNotas(notas).subscribe(
        data=>{
          alert("se registró el participante ");
          this.obtenerParticipantesFinales();
        }
      )
    }
  }
  //

  // TAER TODOS LOS ESTUDIANTES YA GUARDADOS 
  listNotas: Notas[] = [];

  public obtenerParticipantesFinales():void{
    this.notasService.getParticipantesFinales(this.idCursoGlobal!).subscribe(
      data =>{
        this.listNotas = data;
      }
    )
  }
  

  // CREAR NOTAS POR ESTUDIANTE

  /* MODAL */
  visible?: boolean;
  idCapModelEdit?: number;


  // EDIT AND CREATE RESULTADOS //
  public showModalNotas(idParticpanteNota: number) {
    this.visible = true;
      this.notasService.getNotasById(idParticpanteNota).subscribe(
        data => {
          this.notas = data;
          this.idCapModelEdit = this.notas.idNota;
        }
      )
  }
  

  public guardarNotaPorEstudiante():void{
    this.notasService.updateNotas(this.idCapModelEdit!,this.notas).subscribe(
      data=>{
        this.notas= data;
        this.obtenerParticipantesFinales();
        alert("se registro la nota")
        this.visible = false;
      }
    )       
  }
  //

}
