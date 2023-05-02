import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { PrerequisitoCurso } from 'src/app/models/prerequisito-curso';
import { CursoService } from 'src/app/service/curso.service';
import { inscritosService } from 'src/app/service/inscritos.service';
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
    private prerrequistosService: PrerrequisitosCursoService,
    private inscritosService: inscritosService
  ) {
  }

  idCursoGlobal!: number;
  idUsuarioGlobal!: any;
  dataCurso: Curso = new Curso();

  ngOnInit(): void {
    this.idUsuarioGlobal = localStorage.getItem('id_username');
    this.activateRoute.params.subscribe( (param) =>{
      const idCursoROut = param['id'];
      this.idCursoGlobal = idCursoROut;
      console.log("Idcurso => " + idCursoROut)
      this.traerDatosCursoId();
    });
    this.ValidarSuIsncripcion();
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
  
  public pasarInfoCursoIsncripcion(idCurso:any):void{
    this.router.navigate(['/mat', idCurso ]);
  }


  // validar si ya se inscribio en el curso
  isInscritoInCourse!:boolean;
  public ValidarSuIsncripcion():void{
    this.inscritosService.getInscrioValidacion(this.idCursoGlobal,this.idUsuarioGlobal).subscribe(
      data => {
        if (data == true) {
          console.log("ya esta inscrito en este curso")
          this.isInscritoInCourse = true;
        } else {
          console.log("NO esta inscrito en este curso")
          this.isInscritoInCourse = false;
        }
      }
    )
  }
}
