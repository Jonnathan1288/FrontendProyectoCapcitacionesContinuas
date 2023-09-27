import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Asistencia } from 'src/app/models/asistencia';
import { Curso } from 'src/app/models/curso';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { CourseFilterDocente } from 'src/app/models/references/course-filter-by-docente';
import { CursoService } from 'src/app/service/curso.service';
import { NotasService } from 'src/app/service/notas.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

@Component({
	selector: 'app-view-inicio-curso-matriculados',
	templateUrl: './view-inicio-curso-matriculados.component.html',
	styleUrls: ['./view-inicio-curso-matriculados.component.css'],
})
export class ViewInicioCursoMatriculadosComponent implements OnInit {
	public listParticipantesMatriculados: ParticipantesMatriculados[] = [];
	public idCursoMatricula?: number;

	public asistenciaEstudiante = new Asistencia();

	first = 0;
	layout: string = 'list';
	rows = 5;

	public estadoFinal?: any;

	public listCourseFilter: CourseFilterDocente[] = [];

	public idUsuarioIsLogin: any;

	constructor(
		private participantesMatriculadosService: ParticipanteMatriculadoService,
		private router: Router,
		private cursoService: CursoService,
		private notasService: NotasService,
		private toastrService: ToastrService
	) { }
	ngOnInit(): void {

		this.idUsuarioIsLogin = getAttributeStorage(LocalStorageKeys.ID_USUARIO)!;
		this.findFilterCoursesByUsuarioDocente(this.idUsuarioIsLogin!);
	}

	public findFilterCoursesByUsuarioDocente(idUser: number) {
		this.cursoService.findFilterCoursesByUsuarioDocente(idUser).subscribe({
			next: (resp) => {
				this.listCourseFilter = resp;
				this.listCourseFilter.length > 0 ? '' : this.toastrService.info("", "EN ESTE MOMENTO NO TIENE CURSOS");

			}, error: (err) => {
				this.toastrService.error("", "PROBLEMAS AL OBTENER CURSOS");
			}
		});
	}

	public participantsVisibleData: boolean = false;
	public catchCourseSelected(curso: CourseFilterDocente) {
		if (curso.estadoAprovacionCurso !== 'A') {
			this.toastrService.info("", "EL CURSO AÚN NO ESTA APROBADO");
			this.listParticipantesMatriculados = []
			this.participantsVisibleData = false;
			return;
		}

		this.idCursoMatricula = curso.idCurso;
		this.estadoFinal = curso.estadoPublicasionCurso;
		localStorage.setItem('status', String(curso.estadoPublicasionCurso));
		this.traerParticipantesMatriculados(curso.idCurso!);
		this.validarNotasFinales3Dias();
	}

	//-------------------------------------------------------

	curso: Curso = new Curso();
	isFalstanTresDias!: boolean;
	diasFaltantes!: any;
	fechaActual = new Date();
	public validarNotasFinales3Dias(): void {
		this.cursoService
			.getCursoById(this.idCursoMatricula!)
			.subscribe((data) => {
				this.curso = data;
				const fechaFin = new Date(this.curso.fechaFinalizacionCurso!);
				this.diasFaltantes =
					Math.round(
						Math.abs(
							(this.fechaActual.getTime() - fechaFin.getTime()) /
							(24 * 60 * 60 * 1000)
						)
					) + 1;
				console.log(
					'Dias q termina >' + fechaFin + ' la actual ' + this.fechaActual
				);
				console.log('Dias restantes ->' + this.diasFaltantes);
				if (this.diasFaltantes <= 3) {
					this.isFalstanTresDias = true;
				} else {
					this.isFalstanTresDias = false;
				}
				this.validarExistenciaDeRegistros();
			});
	}

	isValidateExistenciaNotas!: boolean;
	public validarExistenciaDeRegistros(): void {
		this.notasService
			.validarExistenciaDatos(this.idCursoMatricula!)
			.subscribe((data) => {
				if (data == false) {
					// SI HAY DATOS
					this.isValidateExistenciaNotas = false;
				} else {
					// NO HAY DATOS
					this.isValidateExistenciaNotas = true;
				}
			});
	}

	public traerParticipantesMatriculados(idCurso: number) {
		this.participantesMatriculadosService
			.getParticipantesMatriculadosByIdCurso(idCurso)
			.subscribe((data) => {
				this.listParticipantesMatriculados = data;
				this.participantsVisibleData = true;
			});
	}

	public tomarAsistenciaCurso() {
		this.router.navigate([
			'/asistencia/estudiantes/course',
			this.idCursoMatricula,
		]);
	}

	public tomarNotasFinalesCurso() {
		this.router.navigate(['/notas/estudiantes/course', this.idCursoMatricula]);
	}

	//Control del modal para el registro de la informaicon visible
	//PARA EL MODAL

	visible: boolean = false;

	showDialog() {
		this.visible = true;
	}

	//IMPLEMENTACIÓN DE LA TABLA DE PRIMENG
	//Implementacion de la tabla de todo referente a primeng
	next() {
		this.first = this.first + this.rows;
	}

	prev() {
		this.first = this.first - this.rows;
	}

	reset() {
		this.first = 0;
	}

	isLastPage(): boolean {
		return this.listParticipantesMatriculados
			? this.first === this.listParticipantesMatriculados.length - this.rows
			: true;
	}

	isFirstPage(): boolean {
		return this.listParticipantesMatriculados ? this.first === 0 : true;
	}

	calcularEdad(fechaNacimiento: string): number {
		const fechaNacimientoDate = new Date(fechaNacimiento);
		const fechaActual = new Date();
		const diferenciaTiempo =
			fechaActual.getTime() - fechaNacimientoDate.getTime();
		const edad = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24 * 365.25));
		return edad;
	}
}
