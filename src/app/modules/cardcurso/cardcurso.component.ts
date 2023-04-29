import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { LoadScript } from 'src/app/scripts/load-script';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-cardcurso',
  templateUrl: './cardcurso.component.html',
  styleUrls: ['./cardcurso.component.css', './cardcurso.component.scss']
})
export class CardcursoComponent implements OnInit {


  ngOnInit(): void {
    this.obtenerCursosFull();
  }

  constructor(
    private router: Router,
    private cursoService: CursoService,
  ) {
  }

  listCursos: Curso[] = [];

  public obtenerCursosFull():void{
    this.cursoService.listCurso().subscribe( 
      data=>{
      this.listCursos = data
    })
  }

  public pasarInfoCurso(idCurso:any):void{
    this.router.navigate(['/cardcu/detalle',idCurso ]);
  }

}
