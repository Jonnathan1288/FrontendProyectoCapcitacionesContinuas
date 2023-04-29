import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';

@Component({
  selector: 'app-infocurso',
  templateUrl: './infocurso.component.html',
  styleUrls: ['./infocurso.component.scss']
})
export class InfocursoComponent implements OnInit {


  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private cursoService: CursoService,
  ) {
  }

  idCursoGlobal!: number;
  dataCurso: Curso = new Curso();

  ngOnInit(): void {
    this.activateRoute.params.subscribe( (param) =>{
      const idCursoROut = param['id'];
      this.idCursoGlobal = idCursoROut;
      console.log("Idcurso => " + idCursoROut)
      this.traerDatosCursoId();
    });
  }
  
  
  public traerDatosCursoId():void{
    this.cursoService.getCursoById(this.idCursoGlobal).subscribe(
      data =>{
        this.dataCurso = data;
      }
    )
  }
  

}
