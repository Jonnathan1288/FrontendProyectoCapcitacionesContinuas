import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Asistencia } from 'src/app/models/asistencia';
import { Curso } from 'src/app/models/curso';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { CourseFilterDocente } from 'src/app/models/references/course-filter-by-docente';
import { MatriculadoReduce } from 'src/app/models/references/matriculado.reduce';
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
	public idCursoMatricula?: number;

	public asistenciaEstudiante = new Asistencia();

	public layout: string = 'list';
	public first = 0;
	public rows = 5;

	public estadoFinal?: any;

	public listCourseFilter: CourseFilterDocente[] = [];

	public idUsuarioIsLogin: any;

	//NUEVO
	public listMatriculadoReduce: MatriculadoReduce[] = [];

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
	public catchCourseSelected(event: any) {
		const selectedOption = event.value;
		const curso: CourseFilterDocente = selectedOption;

		if (curso.estadoAprovacionCurso !== 'A') {
			this.toastrService.info("", "EL CURSO AÚN NO ESTA APROBADO");
			this.listMatriculadoReduce = []
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

	public curso: Curso = new Curso();
	public isFalstanTresDias!: boolean;
	public diasFaltantes!: any;
	public fechaActual = new Date();
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

	public isValidateExistenciaNotas!: boolean;
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

		this.participantesMatriculadosService.findByAllMatriculadoCursoDocenteCapacitador(idCurso).subscribe({
			next: (resp) => {
				console.table(resp)
				this.listMatriculadoReduce = resp;
				this.participantsVisibleData = true;
				this.toastrService.info('', 'ESTUDIANTES RECUPERADOS');

			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER');
			}
		})
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

	public visible: boolean = false;

	public showDialog() {
		this.visible = true;
	}

	public next() {
		this.first = this.first + this.rows;
	}

	public prev() {
		this.first = this.first - this.rows;
	}

	public reset() {
		this.first = 0;
	}

	public isLastPage(): boolean {
		return this.listMatriculadoReduce
			? this.first === this.listMatriculadoReduce.length - this.rows
			: true;
	}

	public isFirstPage(): boolean {
		return this.listMatriculadoReduce ? this.first === 0 : true;
	}

	public calcularEdad(fechaNacimiento: string): number {
		const fechaNacimientoDate = new Date(fechaNacimiento);
		const fechaActual = new Date();
		const diferenciaTiempo =
			fechaActual.getTime() - fechaNacimientoDate.getTime();
		const edad = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24 * 365.25));
		return edad;
	}
}
