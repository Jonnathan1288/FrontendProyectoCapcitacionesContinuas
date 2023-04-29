import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { PrerequisitoCurso } from 'src/app/models/prerequisito-curso';
import { CursoService } from 'src/app/service/curso.service';
import { PrerrequisitosCursoService } from 'src/app/service/prerrequisitosCurso.service';

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
    private prerrequistosService: PrerrequisitosCursoService
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
        this.traerPrerequisitosCurso();
      }
    )
  }

  listPrerrequistos: PrerequisitoCurso[] = [];

  public traerPrerequisitosCurso():void{
    this.prerrequistosService.getPrerequisitoPropiosCurso(this.idCursoGlobal).subscribe(
      data => {
        this.listPrerrequistos = data;
      })
  }
  

}
