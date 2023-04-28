import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { ListaNecesidadCurso } from 'src/app/models/lista-necesidad-curso';
import { NececidadCurso } from 'src/app/models/nececidad-curso';
import { CursoService } from 'src/app/service/curso.service';
import { ListaNecesidadCursoService } from 'src/app/service/lista-necesidad-curso.service';
import { NecesidadCursoService } from 'src/app/service/necesidad-curso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-registro-necesidad',
  templateUrl: './registro-necesidad.component.html',
  styleUrls: ['./registro-necesidad.component.css'],
})
export class RegistroNecesidadComponent implements OnInit {
  public listNecesidadC: ListaNecesidadCurso[] = [];
  public necesidad: NececidadCurso[] = [];

  public curso = new Curso();
  public necesidadcresponse = new NececidadCurso();
  public listaNece = new ListaNecesidadCurso();

  public necesidadActivo = new NececidadCurso();

  idCurso: any;
  constructor(
    private cursoService: CursoService,
    private necesidadSer: NecesidadCursoService,
    private listanecSer: ListaNecesidadCursoService,
    private router: Router,
    private actiRouter: ActivatedRoute,
    private reportService: ReportsCapacitacionesService
  ) {}

  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const id_curso = params['id'];
this.idCurso = id_curso;
      this.traerNecesidadPorCurso(id_curso);
      this.traerCursoAsiganado(id_curso);
    });
  }

  public traerCursoAsiganado(idCurso: number) {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      this.curso = data;
    });
  }

  public createNecesidaCurso() {
    this.necesidadActivo.curso = this.curso;
    this.necesidadSer
      .crearNecesidadCurso(this.necesidadActivo)
      .subscribe((data) => {
        if (data != null) {
          for (let listaNecesidades of this.listaNecesidadCursoArr) {
            listaNecesidades.estadoDetalleNecesidad = true;
            listaNecesidades.necesidadCurso = data;
            this.listanecSer
              .saveListaNecesidadCurso(listaNecesidades)
              .subscribe((data) => {
                if (data != null) {
                  alert('Correcto al crear el curso');
                }
              });
          }
        }
      });
  }

  listaNecesidadCursoArr: ListaNecesidadCurso[] = [];

  public almacenarListaNecedidadDeCurso(): void {
    if (!this.listaNece.detalleNececidadCurso) {
      alert('vacio');
    } else {
      this.listaNecesidadCursoArr.push(this.listaNece);
      this.listaNece = new ListaNecesidadCurso();
    }
  }

  public quitarListaNesesidadCurso(necesidad: any): void {
    const index = this.listaNecesidadCursoArr.findIndex(
      (item) => item.detalleNececidadCurso === necesidad
    );
    if (index !== -1) {
      this.listaNecesidadCursoArr.splice(index, 1);
    }
  }

  auxiliarVariableParaList: any;
  public traerNecesidadPorCurso(idNecesidad: number) {
    this.necesidadSer
      .getNecesidadCursoByIdCurso(idNecesidad)
      .subscribe((data) => {
        if (data != null) {
          this.necesidadActivo = data;
          this.auxiliarVariableParaList = this.necesidadActivo.idNecesidadCurso;
          this.traerListDeNecesidadesComoDeatlle();
        }
      });
  }

  public traerListDeNecesidadesComoDeatlle() {
    if (this.auxiliarVariableParaList) {
      this.listanecSer
        .findByNecesidadCurso_IdNecesidadCurso(this.auxiliarVariableParaList)
        .subscribe((data) => {
          this.listaNecesidadCursoArr = data;
        });
    }
  }

  public editNecesidad(necesidad: any) {
    this.necesidadActivo = {
      ...necesidad,
    };
  }

  public editListNecesidad(listaNecesidad: any) {
    this.listaNece = {
      ...listaNecesidad,
    };
  }

  public getReportNecesidadCurso() {
    this.reportService.getDownloadReportNecesidadCurso(this.idCurso)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }
}
