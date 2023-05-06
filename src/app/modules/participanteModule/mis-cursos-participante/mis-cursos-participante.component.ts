import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-mis-cursos-participante',
  templateUrl: './mis-cursos-participante.component.html',
  styleUrls: ['./mis-cursos-participante.component.scss']
})
export class MisCursosParticipanteComponent implements OnInit {

  // NEW
  layout: string = 'list';


  //Implementacion de el servicio para que el usuario 
  constructor(
    private cursosService: CursoService,
    private router: Router,
  ){
  }

  idUsuarioStorage!:any;

  ngOnInit(): void {
    this.idUsuarioStorage = localStorage.getItem('id_username');
    this.obtenerCursosParticiapnte();
  }

  cursosList: Curso[] = [];
  public obtenerCursosParticiapnte():void{
    this.cursosService.listCursoDelParticipante(this.idUsuarioStorage).subscribe(
      data =>{
        this.cursosList = data;
      }
    )
  }
  verDetallesCurso(idCurso:any){
    this.router.navigate(['panel/course/' + idCurso]).then(() => {
      // window.location.reload();
    });
  }
}
