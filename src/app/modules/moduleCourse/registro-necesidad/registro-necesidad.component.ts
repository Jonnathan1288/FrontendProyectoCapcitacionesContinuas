import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { ListaNecesidadCurso } from 'src/app/models/lista-necesidad-curso';
import { NececidadCurso } from 'src/app/models/nececidad-curso';
import { CursoService } from 'src/app/service/curso.service';
import { ListaNecesidadCursoService } from 'src/app/service/lista-necesidad-curso.service';
import { NecesidadCursoService } from 'src/app/service/necesidad-curso.service';

@Component({
  selector: 'app-registro-necesidad',
  templateUrl: './registro-necesidad.component.html',
  styleUrls: ['./registro-necesidad.component.css'],
})
export class RegistroNecesidadComponent implements OnInit {
  public listNecesidadC: ListaNecesidadCurso[] = [];
  public necesidad: NececidadCurso[] = [];

  public curso = new Curso();
  public necesidadc = new NececidadCurso();
  public necesidadcresponse = new NececidadCurso();
  public listaNece = new ListaNecesidadCurso();

  constructor(
    private cursoService: CursoService,
    private necesidadSer: NecesidadCursoService,
    private listanecSer: ListaNecesidadCursoService,
    private router: Router,
    private actiRouter: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const id_persona = params['id'];
      // this.optenerDatos(id_persona);
    });

    this.cursoService.getCursoById(1).subscribe((data) => {
      this.curso = data;
    });
    this.findByAll()
    this.findById()
  }

  public silabo(idcurso: number){
    localStorage.setItem('idCurso', String(idcurso));
    location.replace('/silabo');
  }

  public editNecesidad(necesidad: any) {
    this.necesidadc = {
      ...necesidad,
    };
  }

  public editListNecesidad(listaNecesidad: any) {
    this.listaNece = {
      ...listaNecesidad,
    };
  }

  findByAll() {
    this.listanecSer.listListaNecesidadCurso().subscribe((data) => {
      this.listNecesidadC = data
    });

    this.necesidadSer
      .getNecesidadCursoById(1)
      .subscribe((data) => {

      });
  }

  createNecesidaCurso() {
    if (this.necesidadc) {
      this.necesidadSer
        .updateNecesidadCurso(
          this.necesidadc.idNecesidadCurso!,
          this.necesidadc
        )
        .subscribe((data) => {
          this.necesidadcresponse = data;
          if (data != null) {
            this.necesidad = [this.necesidadcresponse];
          }
        });
    } else {
      this.necesidadSer
        .crearNecesidadCurso(this.necesidadc)
        .subscribe((data) => {
          this.necesidadcresponse = data;
          if (data != null) {
            this.necesidad = [this.necesidadcresponse];
          }
        });
    }
  }

  createListaNecesidad() {
    
    this.listanecSer
      .saveListaNecesidadCurso(this.listaNece)
      .subscribe((data) => {
        if (data != null) {
          alert('bien');
        }
      });
  }

  findById(){
    this.necesidadSer.getNecesidadCursoById(1).subscribe((data)=>{
      this.listaNece.necesidadCurso = data;
    })
  }
}
