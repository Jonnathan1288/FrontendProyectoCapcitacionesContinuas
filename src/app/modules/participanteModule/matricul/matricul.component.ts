import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { DetalleFichaMatricula } from 'src/app/models/detalle-ficha-matricula';
import { Inscrito } from 'src/app/models/inscrito';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { Usuario } from 'src/app/models/usuario';
import { CursoService } from 'src/app/service/curso.service';
import { DetalleFichaService } from 'src/app/service/detalle-ficha.service';
import { inscritosService } from 'src/app/service/inscritos.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

@Component({
  selector: 'app-matricul',
  templateUrl: './matricul.component.html',
  styleUrls: ['./matricul.component.css'],
})
export class MatriculComponent implements OnInit {
  public inscritos = new Inscrito();
  public detallefichaMatricula = new DetalleFichaMatricula();
  public usuario = new Usuario();
  public curso = new Curso();
  public participantesMatriculados = new ParticipantesMatriculados();

  public idUserLoggin: any;
  public idCursoCap: any;

  public idDetalleFichaMaricula?: number;

  constructor(
    private usuarioServie: UsuarioService,
    private inscritosService: inscritosService,
    private activateRoute: ActivatedRoute,
    private cursoService: CursoService,
    private detalleFichaMatriculaService: DetalleFichaService,
    private reportService: ReportsCapacitacionesService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.idUserLoggin = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
    this.traerUsuarioLogin();
    this.activateRoute.params.subscribe((param) => {
      const idCursoROut = param['id'];
      this.idCursoCap = idCursoROut;
      this.traerDatosCursoId(this.idCursoCap);
      console.log('Idcurso => ' + idCursoROut);
    });
  }

  public traerUsuarioLogin() {
    this.usuarioServie.getUsuarioById(this.idUserLoggin).subscribe((data) => {
      this.usuario = data;
      this.idUsuarioLogin = this.usuario.idUsuario!;
      this.verificarOtraerDatosFichaAlmacenados();
    });
  }

  idUsuarioLogin!: number;
  public verificarOtraerDatosFichaAlmacenados() {
    this.detalleFichaMatriculaService
      .getDetalleFichaMatriculaByIdPorUsuario(this.idUsuarioLogin)
      .subscribe((data) => {
        if (data!) {
          this.detallefichaMatricula = data;
          this.idDetalleFichaMaricula =
            this.detallefichaMatricula.usuario?.idUsuario;
        } else {
          console.log('nuevo');
          this.detallefichaMatricula = new DetalleFichaMatricula();
        }
        this.ValidarSuIsncripcion();
      });
  }

  public traerDatosCursoId(idCurso: number): void {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      this.curso = data;
    });
  }

  public validarFichaMatricula() {
    if (
      !this.detallefichaMatricula.pregunta1 ||
      !this.detallefichaMatricula.pregunta2 ||
      !this.detallefichaMatricula.pregunta3 ||
      !this.detallefichaMatricula.pregunta4 ||
      !this.detallefichaMatricula.pregunta5 ||
      !this.detallefichaMatricula.pregunta6 ||
      !this.detallefichaMatricula.pregunta7 ||
      !this.detallefichaMatricula.pregunta8 ||
      !this.detallefichaMatricula.pregunta9
    ) {
      this.toastrService.error(
        'Verifique los campos que no esten vacíos.',
        'CAMPOS VACíOS.',
        {
          timeOut: 1300,
        }
      );
    } else {
      this.guardarFichadeMatrircla();
    }
  }

  public guardarFichadeMatrircla() {
    this.inscritos.curso = this.curso;
    this.inscritos.usuario = this.usuario;
    this.inscritos.estadoInscrito = false;
    this.inscritos.estadoInscritoActivo = true;
    this.inscritosService
      .saveInscrioParaCurso(this.inscritos)
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.inscritos = data;
          this.detallefichaMatricula.usuario = this.usuario;
          this.detalleFichaMatriculaService
            .saveDetalleFichaMatricula(this.detallefichaMatricula)
            .subscribe((data1) => {
              if (data1 != null) {
                this.detallefichaMatricula = data1;
                this.toastrService.success(
                  'Datos almacenados correctamente.',
                  'FICHA GUARDADA.',
                  {
                    timeOut: 1300,
                  }
                );
                location.reload();
              }
            });
        }
      });
  }

  // editarDetalleFichaMatricula(detalle: DetalleFichaMatricula): void {
  //   if (detalle.idDetalleFichaMatricula) {
  //     this.detalleFichaMatriculaService
  //       .editDetalleFichaMatricula(detalle.idDetalleFichaMatricula, detalle)
  //       .subscribe(
  //         (updatedDetalle) => {
  //           console.log(
  //             `Detalle de ficha de matrícula actualizado: ${updatedDetalle.idDetalleFichaMatricula}`
  //           );
  //         },
  //         (error) => {
  //           console.error(
  //             'Error al actualizar el detalle de ficha de matrícula: ',
  //             error
  //           );
  //         }
  //       );
  //   } else {
  //     console.error(
  //       'El ID del detalle de ficha de matrícula es nulo o no definido'
  //     );
  //   }
  // }

  //mATRICULAS
  public getReportNecesidadCurso() {

    this.reportService
      .gedownloadFichaDeInscripcion(this.inscritos.curso?.idCurso!, this.inscritos.usuario?.idUsuario!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  // validar si ya se inscribio en el curso
  isInscritoInCourse!: boolean;
  public ValidarSuIsncripcion(): void {
    this.inscritosService
      .getInscrioValidacion(this.idCursoCap, this.idUserLoggin)
      .subscribe((data) => {
        if (data == true) {
          // alert('Ya estas inscrito')
          this.isInscritoInCourse = true;
          this.inscritosService
            .getInscritoByIdUsuario(this.idCursoCap, this.idUserLoggin)
            .subscribe((data) => {
              this.inscritos = data;
            });
        } else {
          console.log('NO esta inscrito en este curso');
          this.isInscritoInCourse = false;
        }
      });
  }

  CambioAuspiciado() {
    if (this.detallefichaMatricula.pregunta6 === 'No') {
      this.detallefichaMatricula.pregunta7 = 'N/A';
      this.detallefichaMatricula.pregunta8 = 'N/A';
      this.detallefichaMatricula.pregunta9 = 'N/A';
    } else {
      this.detallefichaMatricula.pregunta7 = '';
      this.detallefichaMatricula.pregunta8 = '';
      this.detallefichaMatricula.pregunta9 = '';
    }
  }
  
}
