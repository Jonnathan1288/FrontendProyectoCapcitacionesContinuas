import { Component, OnInit } from '@angular/core';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { CursoService } from 'src/app/service/curso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { ParticipantsApproved } from 'src/app/models/references/participants-approved';
import { CourseFilterDocente } from 'src/app/models/references/course-filter-by-docente';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

import * as Highcharts from 'highcharts';

import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);

@Component({
	selector: 'app-asignacion-codigos-cenecyt',
	templateUrl: './asignacion-codigos-cenecyt.component.html',
	styleUrls: ['./asignacion-codigos-cenecyt.component.css'],

})
export class AsignacionCodigosCenecytComponent implements OnInit {
	//CODIGO DE PRIME

	loading: boolean = false;

	//DONDE INICIAMOS CON LA PARTE FUNCIONAL DEL COMPONENETE
	public classParicipanteAprovado = new ParticipantesMatriculados();


	public editing?: boolean = false;
	public capturarIdCurso?: any;

	public idUsuarioIsLoggin?: any;
	public listCursoCapacitador: CourseFilterDocente[] = [];

	///
	public listParticipantsApproved: ParticipantsApproved[] = [];
	constructor(
		private participantesAprovadoService: ParticipanteAprobadoService,
		private reportService: ReportsCapacitacionesService,
		private toastrService: ToastrService,
		private cursoService: CursoService,
	) {

	}

	ngOnInit(): void {
		this.idUsuarioIsLoggin = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
		this.findByIdUsuarioEstadoCursoFinalizado(this.idUsuarioIsLoggin);
	}

	public findByIdUsuarioEstadoCursoFinalizado(idUsuario: number) {

		this.cursoService.findByIdUsuarioEstadoCursoFinalizado(idUsuario).subscribe({
			next: (resp) => {
				this.listCursoCapacitador = resp;
				this.listCursoCapacitador.length > 0 ? '' : this.toastrService.info("", "EN ESTE MOMENTO NO TIENE CURSOS FINALIZADOS");
			}, error: (err) => {
				this.toastrService.error("", "PROBLEMAS AL OBTENER CURSOS");
			}
		});
	}

	//Captura el curs
	public classCourseSelected = new CourseFilterDocente();
	public catchCourseSelected(curso: CourseFilterDocente) {
		this.classCourseSelected = { ...curso };
	}

	public VerCursoInicio(idCurso: number, estadoFinal: String) {
		localStorage.setItem('status', String(estadoFinal));

		// this.router.navigate(['/verMatriculados/course/inicio', idCurso]);
	}

	//Veneto para obtener los curso que tengo
	public idCursoFinalRepors?: any;
	onCursoSelectionChange(event: any) {
		const selectedOption = event.value;
		const selectedCursoId = selectedOption ? selectedOption.idCurso : null;
		this.loading = true;
		this.idCursoFinalRepors = selectedCursoId;
		this.getParticipanteAprovadoPorIdCursoParCodigosCenecyt(selectedCursoId);
	}

	public getParticipanteAprovadoPorIdCursoParCodigosCenecyt(idCurso: number) {
		this.participantesAprovadoService
			.getParticipantesAprobadosByDocenteIdCurso(idCurso)
			.subscribe((data) => {
				this.listParticipantsApproved = data
				this.loading = false;
				this.chartParticipantes();
			});

		this.participantesAprovadoService.getParticipantesAprobadosByDocenteIdCurso(idCurso).subscribe({
			next: (resp) => {
				this.listParticipantsApproved = resp;
				this.loading = false;
			}, error: (err) => {
				this.loading = false;
				this.listParticipantsApproved = [];
				this.toastrService.error("", "PROBLEMAS AL OBTENER PARTICIPANTES");
			}
		});
	}

	//TODO DE LO QUE SON REPORTES
	//IMPRIMIR TODOS LOS ESTUDIANTES APROVADOS POR CURSO CO CODIGOS DE LA SENECYT
	public getCodigosSenecytDownload() {
		this.reportService
			.downloadCodigosSenecyt(this.idCursoFinalRepors)
			.subscribe((r) => {
				const url = URL.createObjectURL(r);
				window.open(url, '_blank');
			});
	}

	//IMPRIMIR TODOS LOS ESTUDIANTES APROVADOS POR CURSO CO CODIGOS DE LA SENECYT
	public getEstudiantesParaHacerFirmar() {
		this.reportService
			.downloadEntregaCertificadoEstudiante(this.idCursoFinalRepors)
			.subscribe((r) => {
				const url = URL.createObjectURL(r);
				window.open(url, '_blank');
			});
	}

	//IMPRIMIR FICCHA EVALUACION FINAL CURSO
	public getFichaEvalucaionFinalCurso() {
		this.reportService
			.downloadFichaEvaluacionFinalCurso(this.idCursoFinalRepors)
			.subscribe((r) => {
				const url = URL.createObjectURL(r);
				window.open(url, '_blank');
			});
	}

	//IMPLEMENTS CHART
	public chartParticipantes() {
		const notas = this.listParticipantsApproved.map((i) => (i.genero));

		const inform = notas.reduce((conteo, gender) => {
			gender === 'M' ? conteo[0].y++ : gender === 'F' ? conteo[1].y++ : conteo[2].y++
			return conteo;
		}, [
			{ name: 'HOMBRES', y: 0 },
			{ name: 'MUJERES', y: 0 },
			{ name: 'OTRO', y: 0 },
		]);

		this.rendererGenderChart(inform);
	}


	Highcharts: typeof Highcharts = Highcharts;
	chartOptions!: Highcharts.Options;

	public rendererGenderChart(inform: any) {
		this.chartOptions = {
			chart: {
				type: 'pie'
			},
			title: {
				text: 'REPORTE DE GENERO DE ESTUDIANTES'
			},

			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y} estudiante/s'
					},
					showInLegend: true,
				}
			},
			series: [
				{
					name: 'Equivalente',
					type: 'pie',

					data: inform as []
				}
			],
			colors: ['#22C55E', '#F59E0B', '#1919FF', '#828E8C']
		};

	}
}