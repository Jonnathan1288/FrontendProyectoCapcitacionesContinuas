import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { PrerequisitoCurso } from 'src/app/models/prerequisito-curso';
import { HojaVida } from 'src/app/models/references/hoja-vida';
import { CursoService } from 'src/app/service/curso.service';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { inscritosService } from 'src/app/service/inscritos.service';
import { PrerrequisitosCursoService } from 'src/app/service/prerrequisitosCurso.service';
import { FOLDER_DOCUMENTS_HOJA_VIDA, getFile } from 'src/app/util/folder-upload';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

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
    private toastrService: ToastrService,
    private prerrequistosService: PrerrequisitosCursoService,
    private hojaVidaService: HojaVidaCapacitadorService,
    private inscritosService: inscritosService
  ) {
  }

  idCursoGlobal!: number;
  idUsuarioGlobal!: any;
  idUsuarioTraido!:any;
  dataCurso: Curso = new Curso();
  public hojaVida = new HojaVida();

  ngOnInit(): void {
    this.idUsuarioGlobal = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
    this.activateRoute.params.subscribe((param) => {
      const idCursoROut = param['id'];
      this.idCursoGlobal = idCursoROut;
      this.obtenerCursosParticipante();
      this.traerDatosCursoId();
    });
    this.ValidarSuIsncripcion();
  }

  cursosListInscritos: Curso[] = [];
  fechaFinCursoInscrito: Date[] = [];

  // validarCursoInscrito(fechaInicioCursoSeleccionada: Date): boolean {
  //   return this.fechaFinCursoInscrito.every(fecha => fechaInicioCursoSeleccionada > fecha);
  // }

  public obtenerCursosParticipante(): void {
    this.cursoService.listCursoDelParticipante(this.idUsuarioGlobal).subscribe(
      data => {
        this.cursosListInscritos = data;
        for (let cursos of this.cursosListInscritos) {
          if (cursos.estadoPublicasionCurso == 'I') {
            this.fechaFinCursoInscrito.push(cursos.fechaFinalizacionCurso!);
          }
        }
      }
    )
  }

  public traerDatosCursoId(): void {
    this.cursoService.getCursoById(this.idCursoGlobal).subscribe(
      data => {
        this.dataCurso = data;
        this.idUsuarioTraido =data.capacitador?.usuario?.idUsuario;
        this.obtenerHojaDeVidata(this.idUsuarioTraido);
        this.traerPrerequisitosCurso();
      }
    )
  }

  listPrerrequistos: PrerequisitoCurso[] = [];

  public traerPrerequisitosCurso(): void {
    this.prerrequistosService.getPrerequisitoPropiosCurso(this.idCursoGlobal).subscribe(
      data => {
        this.listPrerrequistos = data;
      })
  }

  public pasarInfoCursoIsncripcion(idCurso: any, fechaInicio: Date): void {
    // if (this.validarCursoInscrito(fechaInicio) != true) {
    //   this.toastrService.error(' Tiene un curso por terminar!', 'Advertencia');
    // } else {
    this.router.navigate(['/mat', idCurso]);
    // }
  }

  public getFileResource(): string {
		return getFile(this.hojaVida.uriDocument!, FOLDER_DOCUMENTS_HOJA_VIDA);
	}

  public obtenerHojaDeVidata(id: number) {
		this.hojaVidaService.findDocumentByIdUsuario(id).subscribe({
			next: (resp) => {
				this.hojaVida = resp;

			}, error: (err) => {
			}
		})
	}

  // validar si ya se inscribio en el curso
  isInscritoInCourse!: boolean;
  public ValidarSuIsncripcion(): void {
    this.inscritosService.getInscrioValidacion(this.idCursoGlobal, this.idUsuarioGlobal).subscribe(
      data => {
        if (data == true) {
          this.isInscritoInCourse = true;
        } else {
          this.isInscritoInCourse = false;
        }
      }
    )
  }
}
