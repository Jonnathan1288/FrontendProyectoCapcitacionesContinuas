import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { Usuario } from 'src/app/models/usuario';
import { LoadScript } from 'src/app/scripts/load-script';
import { CursoService } from 'src/app/service/curso.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

@Component({
  selector: 'app-panel-modulo-cursos',
  templateUrl: './panel-modulo-cursos.component.html',
  styleUrls: ['./panel-modulo-cursos.component.css', './panel-modulo-cursos.component .scss']
})
export class PanelModuloCursosComponent implements OnInit {


  constructor(
    private cursoService: CursoService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private reportService: ReportsCapacitacionesService,
    private usuarioService: UsuarioService,
    private participantesMatriulados: ParticipanteMatriculadoService
  ) {
  }

  idCursoGlobal?: number;
  idUsuarioIsLoggin?: any;
  ngOnInit(): void {
    this.idUsuarioIsLoggin = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
    this.activateRoute.params.subscribe((param) => {
      const idCurso = param['id'];
      this.idCursoGlobal = idCurso;
      this.verProgreso();
      this.datosDelUsuario();
      this.buscarAlUsuario();
    });
  }

  usuario: Usuario = new Usuario();
  public datosDelUsuario(): void {
    this.usuarioService.getUsuarioById(this.idUsuarioIsLoggin).subscribe(
      data => {
        this.usuario = data;
      }
    )
  }

  // VALIDACION SI APROBO O NO APROBO
  listaParticipantes: ParticipantesMatriculados[] = [];
  public buscarAlUsuario(): void {
    this.participantesMatriulados.getParticipantesMatriculadosByIdCurso(this.idCursoGlobal!).subscribe(
      data => {
        this.listaParticipantes = data;
        console.log(this.listaParticipantes);
        this.buscarEnLista();
      }
    )
  }

  estadoAprobacionCurso!: String;
  buscarEnLista() {
    for (let participantes of this.listaParticipantes) {
      console.log("esta buscado esta id de usuario " + this.idUsuarioIsLoggin)
      if (participantes.inscrito?.usuario?.idUsuario == this.idUsuarioIsLoggin) {
        this.estadoAprobacionCurso = participantes.estadoParticipanteAprobacion!;
      } else {
        console.log(" no encontroo")
      }
    }
    console.log("Este es su estado -> " + this.estadoAprobacionCurso)
  }
  //

  // CALCULAR EL PROGRESO
  curso: Curso = new Curso();
  progreso: number = 0;
  diasTotal?: any;
  diasTranscurridos?: any;
  fechaActual = new Date();
  public verProgreso(): void {
    this.cursoService.getCursoById(this.idCursoGlobal!).subscribe(
      data => {
        this.curso = data;
        const fechaInicio = new Date(this.curso.fechaInicioCurso!);
        const fechaFin = new Date(this.curso.fechaFinalizacionCurso!);
        this.diasTotal = Math.round(Math.abs((fechaFin.getTime() - fechaInicio.getTime()) / (24 * 60 * 60 * 1000))) + 1;
        this.diasTranscurridos = Math.round(Math.abs((this.fechaActual.getTime() - fechaInicio.getTime()) / (24 * 60 * 60 * 1000)));
        this.progreso = (this.diasTranscurridos / this.diasTotal) * 100;
        console.log("Dias totales -> " + this.diasTotal)
        console.log("Dias transcurridos -> " + this.diasTranscurridos)
        console.log("Progreso -> " + this.progreso)
      }
    )
  }
  // FIN CALCULO

  //DESCARGAR CERTIFICADO DE CADAD ESTUDIANTE

  public downloadCertificadoEstudianteSenecytDownload() {
    console.log("Datos enviar id -> " + this.usuario.persona?.idPersona! + " identi" + this.curso.idCurso! + " el numero dos -> " + this.usuario.persona?.identificacion!)
    this.reportService
      .downloadCertificadoEstudiante(this.curso.idCurso!, this.usuario.persona?.identificacion!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

}
