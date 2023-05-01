import { Component, OnInit } from '@angular/core';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-mis-cursos-participante',
  templateUrl: './mis-cursos-participante.component.html',
  styleUrls: ['./mis-cursos-participante.component.css']
})
export class MisCursosParticipanteComponent implements OnInit {


  constructor(
    private cursosService: CursoService,
  ){
  }

  idUsuarioStorage!:any;

  ngOnInit(): void {
    this.idUsuarioStorage = localStorage.getItem('id_username');
    this.obtenerCursosParticiapnte();
  }

  cursosList: Curso[] = [];
  public obtenerCursosParticiapnte():void{
    this.cursosService.obtenerTodoslosCursosPorIdUsuario(this.idUsuarioStorage).subscribe(
      data =>{
        this.cursosList = data;
      }
    )
  }
}
