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
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
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

  public idCursoUpdate!: any;
  constructor(
    private cursoService: CursoService,
    private necesidadSer: NecesidadCursoService,
    private listanecSer: ListaNecesidadCursoService,
    private router: Router,
    private actiRouter: ActivatedRoute,
    private reportService: ReportsCapacitacionesService,
    public sanitizer: DomSanitizer,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const id_curso = params['id'];
      this.idCurso = id_curso;
      this.traerNecesidadPorCurso(id_curso);
      this.traerCursoAsiganado(id_curso);
    });
  }

  public isNecesidadActivoPresente(): boolean {
    return !!(this.necesidadActivo && this.necesidadActivo.idNecesidadCurso);
  }

  public traerCursoAsiganado(idCurso: number) {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      this.curso = data;
    });
  }

  public validacionCaposNecesidadCurso() {
    if (
      !this.necesidadActivo.espacioImpartirNecesidadCurso ||
      !this.necesidadActivo.resumenCurso ||
      !this.necesidadActivo.poblacionDirijida
    ) {
      this.toastrService.error(
        'Algúnos campos no estan llenos.',
        'ALGUNOS CAMPOS VACÍOS.',
        {
          timeOut: 1300,
        }
      );
    } else {
      if (this.listaNecesidadCursoArr.length >= 1) {
        this.createNecesidaCurso();
      } else {
        this.toastrService.error(
          'Debe llenar por minimo una necesidad a la población.',
          'NECESIDAD VACÍA.',
          {
            timeOut: 1600,
          }
        );
      }
    }
  }
  public createNecesidaCurso() {
    if (this.necesidadActivo.idNecesidadCurso) {
      this.necesidadSer
        .updateNecesidadCurso(
          this.necesidadActivo.idNecesidadCurso,
          this.necesidadActivo
        )
        .subscribe((data) => {
          if (data != null) {
            this.toastrService.success(
              'Informe de necesidad de curso actualizado.',
              'ACTUALIZADO.',
              {
                timeOut: 1300,
              }
            );
            setTimeout(() => {
              location.reload();
            }, 1300);
          }
        });
      console.log(this.necesidadActivo);
    } else {
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
                   console.log('right')
                  }
                });
            }
            this.toastrService.success(
              'Informe de necesidad creado con éxito.',
              'DATOS ALMACENADOS.',
              {
                timeOut: 1300,
              }
            );
            setTimeout(() => {
              location.reload();
            }, 1300);
          }
        });
    }
  }

  listaNecesidadCursoArr: ListaNecesidadCurso[] = [];

  public almacenarListaNecedidadDeCurso(): void {
    if (!this.listaNece.detalleNececidadCurso) {
      this.toastrService.error(
        'Deebe llenar el campo de detalle.',
        'CAMPO VACÍO.',
        {
          timeOut: 1300,
        }
      );
    } else {
      if (this.listaNecesidadCursoArr.length === 8) {
        this.toastrService.error(
          'A exedido el limite de 8 necesidades',
          'LIMITE DE 8.',
          {
            timeOut: 1300,
          }
        );
      } else {
        this.listaNecesidadCursoArr.push(this.listaNece);
        this.listaNece = new ListaNecesidadCurso();
      }
    }
  }

  public quitarListaNesesidadCurso(necesidad: any): void {
    const index = this.listaNecesidadCursoArr.findIndex(
      (item) => item.detalleNececidadCurso === necesidad
    );
    if (index !== -1) {
      this.listaNecesidadCursoArr.splice(index, 1);
      this.toastrService.error('Necesida de curso quitado.', 'ELIMINADO.', {
        timeOut: 1300,
      });
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
          this.listaNecesidadCursoArr = this.listaNecesidadCursoArr.filter(
            (list) => list.estadoDetalleNecesidad === true
          );

          // this.listaNecesidadCursoArr = data;
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
    this.reportService
      .getDownloadReportNecesidadCurso(this.idCurso)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
    // this.getPdf()
  }

  //PARA LA EDICION EN EL MODAL

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  //ELIMINADO LOGICO DE DETALLE DE NECESIDAD DE CURSO
  public eliminadologicoDeInfNecesidadCurso(
    necesidadCurso: ListaNecesidadCurso
  ) {
    necesidadCurso.estadoDetalleNecesidad = false;
    this.listanecSer
      .updateListaNecesidadCurso(
        necesidadCurso.idListaNecesidadCursos!,
        necesidadCurso
      )
      .subscribe((data) => {
        this.traerListDeNecesidadesComoDeatlle();
        this.listaNecesidadCursoArr;

        this.toastrService.warning('Necesidad eliminada.', 'ELIMINADO.', {
          timeOut: 1000,
        });
      });
  }

  public updateCreate() {
    this.listaNece.necesidadCurso = this.necesidadActivo;

    if (this.listaNecesidadCursoArr.length === 8) {
      this.toastrService.error(
        'A exedido el limite de 8 necesidades',
        'LIMITE DE 8.',
        {
          timeOut: 1300,
        }
      );
    } else {
      if (this.listaNece.idListaNecesidadCursos) {
        this.listanecSer
          .updateListaNecesidadCurso(
            this.listaNece.idListaNecesidadCursos,
            this.listaNece
          )
          .subscribe((data) => {
            this.traerListDeNecesidadesComoDeatlle();
            this.toastrService.success(
              'Necesida actualizada.',
              'ACTUALIZADO.',
              {
                timeOut: 1000,
              }
            );
          });
      } else {
        this.listaNece.estadoDetalleNecesidad = true;
        this.listanecSer
          .saveListaNecesidadCurso(this.listaNece)
          .subscribe((data) => {
            this.traerListDeNecesidadesComoDeatlle();

            this.toastrService.success(
              'Necesida agregada con éxito.',
              'CREADO.',
              {
                timeOut: 1000,
              }
            );
          });
      }
    }
    this.listaNece = new ListaNecesidadCurso();
    this.visible = false;
  }
}
