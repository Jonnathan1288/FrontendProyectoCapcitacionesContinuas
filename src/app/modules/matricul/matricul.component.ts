import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { DetalleFichaMatricula } from 'src/app/models/detalle-ficha-matricula';
import { FichaMatricula } from 'src/app/models/fichaMatricula';
import { Inscrito } from 'src/app/models/inscrito';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { Usuario } from 'src/app/models/usuario';
import { CursoService } from 'src/app/service/curso.service';
import { DetalleFichaService } from 'src/app/service/detalle-ficha.service';
import { inFichaMatriculaService } from 'src/app/service/ficha-matricula.service';

import { inscritosService } from 'src/app/service/inscritos.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-matricul',
  templateUrl: './matricul.component.html',
  styleUrls: ['./matricul.component.css'],
})
export class MatriculComponent implements OnInit {
  public inscritos = new Inscrito();
  public fichaMatricula = new FichaMatricula();
  public detallefichaMatricula = new DetalleFichaMatricula();
  public usuario = new Usuario();
  public curso = new Curso();
  public participantesMatriculados = new ParticipantesMatriculados();

  public idUserLoggin: any;
  public idCursoCap: any;

  constructor(
    private usuarioServie: UsuarioService,
    private inscritosService: inscritosService,
    private activateRoute: ActivatedRoute,
    private cursoService: CursoService,
    private fichamatriculaService: inFichaMatriculaService,
    private detalleFichaMatriculaService: DetalleFichaService,
    private reportService: ReportsCapacitacionesService
  ) {}

  ngOnInit(): void {
    this.idUserLoggin = localStorage.getItem('id_username');
    this.traerUsuarioLogin(this.idUserLoggin);
    this.activateRoute.params.subscribe((param) => {
      const idCursoROut = param['id'];
      this.idCursoCap = idCursoROut;
      this.traerDatosCursoId(this.idCursoCap);
      console.log('Idcurso => ' + idCursoROut);
    });
  }

  public traerUsuarioLogin(idUsuario: number) {
    this.usuarioServie.getUsuarioById(idUsuario).subscribe((data) => {
      this.usuario = data;
    });
  }

  public traerDatosCursoId(idCurso: number): void {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      this.curso = data;
    });
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
          this.fichaMatricula.inscrito = this.inscritos;
          this.fichamatriculaService
            .saveFichaMatricula(this.fichaMatricula)
            .subscribe((data1) => {
              if (data1 != null) {
                this.fichaMatricula = data1;
                this.detallefichaMatricula.fichaMatricula = this.fichaMatricula;
                this.detalleFichaMatriculaService
                  .saveDetalleFichaMatricula(this.detallefichaMatricula)
                  .subscribe((data2) => {
                    if (data2 != null) {
                      this.getReportNecesidadCurso(this.inscritos.idInscrito!);
                      alert('Inscrito satisfactoriamente');
                    }
                  });
              }
            });
        }
      });
  }

  editarDetalleFichaMatricula(detalle: DetalleFichaMatricula): void {
    if (detalle.idDetalleFichaMatricula) {
      this.detalleFichaMatriculaService
        .editDetalleFichaMatricula(detalle.idDetalleFichaMatricula, detalle)
        .subscribe(
          (updatedDetalle) => {
            console.log(
              `Detalle de ficha de matrícula actualizado: ${updatedDetalle.idDetalleFichaMatricula}`
            );
          },
          (error) => {
            console.error(
              'Error al actualizar el detalle de ficha de matrícula: ',
              error
            );
          }
        );
    } else {
      console.error(
        'El ID del detalle de ficha de matrícula es nulo o no definido'
      );
    }
  }

  //mATRICULAS
  public getReportNecesidadCurso(idInscripcion: number) {
    this.reportService
      .gedownloadFichaDeInscripcion(idInscripcion)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }
}
