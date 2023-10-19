import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { InformeFinalCurso } from 'src/app/models/informe-final-curso';
import { Notas } from 'src/app/models/notas';
import { ParticipantesMatriculados } from 'src/app/models/participantesMatriculados';
import { CursoService } from 'src/app/service/curso.service';
import { InformeFinalCursoService } from 'src/app/service/informe-final-curso.service';
import { NotasService } from 'src/app/service/notas.service';
import { ParticipanteMatriculadoService } from 'src/app/service/participante-matriculado.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';

//other
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ParticipanteAprobadoService } from 'src/app/service/participante-aprobado.service';
import { NotaFinalReduce } from 'src/app/models/references/nota-final-reduce';

import * as Highcharts from 'highcharts';

import HC_exporting from 'highcharts/modules/exporting';

HC_exporting(Highcharts);

@Component({
	selector: 'app-registrar-notas-finales',
	templateUrl: './registrar-notas-finales.component.html',
	styleUrls: ['./registrar-notas-finales.component.css'],
	providers: [ConfirmationService],
})
export class RegistrarNotasFinalesComponent implements OnInit {
	first = 0;
	layout: string = 'list';
	rows = 5;

	public classCursoFinalizaEstado = new Curso();

	public estadoFinal?: any;

	constructor(
		private activateRoute: ActivatedRoute,
		private router: Router,
		private participantesMatriculadosService: ParticipanteMatriculadoService,
		private notasService: NotasService,
		private resportService: ReportsCapacitacionesService,
		private informeFinalCorseService: InformeFinalCursoService,
		private cursoService: CursoService,
		private toastrService: ToastrService,
		private confirmationService: ConfirmationService,
		private participantesAprovadosService: ParticipanteAprobadoService
	) { }

	public idCursoGlobal?: number;

	ngOnInit(): void {
		this.estadoFinal = localStorage.getItem('status')
		this.activateRoute.params.subscribe((param) => {
			const idCursoRout = param['id'];
			this.idCursoGlobal = idCursoRout;
			this.validarExistenciaDeRegistros();
			this.getCursoPorIdAlmacenado(idCursoRout);
			this.valida();
		});

	}

	public getCursoPorIdAlmacenado(idCurso: number) {
		this.cursoService.getCursoById(idCurso!).subscribe((data) => {
			if (data != null) {
				this.classCursoFinalizaEstado = data;

			}
		});
	}

	public finalizarCursoCapacitacionContinua() {
		this.confirmationService.confirm({
			message: 'Esta seguro en finalizar el curso?',
			header: 'Confirmación, una vez finalizado no podra hacer cambios.',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Aceptar',
			rejectLabel: 'Cancelar',
			accept: () => {
				// alert()
				this.participantesAprovadosService
					.saveParticipantesAprobadosParacodigoSenecyt(this.idCursoGlobal!)
					.subscribe(
						(data) => {
							if (data != null) {
								this.toastrService.success(
									'El curso a finalizado y sus datos han sido guardados.',
									'CURSO FINALIZADO.',
									{
										timeOut: 2500,
									}
								);

								// this.router.navigate(['/capacitador/codigos/cenecyt']);
							}
							// alert(2)
						},
						(err) => {
							this.toastrService.error(
								'Intentalo más en la tarde.',
								'INCONVENIENTES.',
								{
									timeOut: 1000,
								}
							);
						}
					);
			},
			reject: (type: any) => {
				switch (type) {
					case ConfirmEventType.REJECT:
						this.toastrService.error(
							'Curso cancelado para su finalización.',
							'FINALIZAR CANCELADO.',
							{
								timeOut: 2000,
							}
						);
						break;
					case ConfirmEventType.CANCEL:
						this.toastrService.warning(
							'Curso en espera de finalización',
							'SALIR.',
							{
								timeOut: 2000,
							}
						);

						break;
				}
			},
		});
	}

	public validarExistenciaDeRegistros(): void {
		this.notasService
			.validarExistenciaDatos(this.idCursoGlobal!)
			.subscribe((data) => {
				if (data == false) {
					this.getParticipantsFinallyGrade();
				} else {
					this.traerParticipantesMatriculados();
				}
			});
	}

	public listaParticipantesMatriculados: ParticipantesMatriculados[] = [];
	// TRAER TODOS LOS MATRICULADOS DEL CURSO //
	public traerParticipantesMatriculados(): void {
		this.participantesMatriculadosService
			.getParticipantesMatriculadosByIdCurso(this.idCursoGlobal!)
			.subscribe((data) => {
				this.listaParticipantesMatriculados = data;
				this.guardarDatosVacios();
			});
	}
	// FIN //
	public notas: Notas = new Notas();
	// MANDAR LOS DATOS A LA TABLA
	public guardarDatosVacios(): void {
		for (let participante of this.listaParticipantesMatriculados) {
			if (participante.estadoParticipanteActivo === true) {
				const notas = new Notas();
				notas.partipantesMatriculados = participante;
				notas.examenFinal = 0;
				notas.observacion = '';
				notas.informe1 = 0;
				notas.informe2 = 0;
				notas.informe3 = 0;
				this.notasService.saveNotas(notas).subscribe((data) => {
					// alert('se registró el participante ');
					this.obtenerParticipantesFinales();
				});
			}
		}
	}
	//

	// TAER TODOS LOS ESTUDIANTES YA GUARDADOS

	public obtenerParticipantesFinales(): void {
		this.notasService
			.getParticipantesFinales(this.idCursoGlobal!)
			.subscribe((data) => {

			});
	}

	public notasFinalesReduce: NotaFinalReduce[] = [];
	public getParticipantsFinallyGrade() {
		this.notasService.findAllNotasFinalesByIdCurso(this.idCursoGlobal!).subscribe({
			next: (resp) => {
				this.notasFinalesReduce = resp;
				this.chartParticipantes();
			}, error: (err) => {

			}
		})
	}

	/* MODAL */
	public visible?: boolean;
	public idCapModelEdit?: number;

	// EDIT AND CREATE RESULTADOS //
	public notaFinalReduceCopy = new NotaFinalReduce();
	public showModalNotas(idParticpanteNota: number, notasFinalesReduce: NotaFinalReduce) {
		this.notaFinalReduceCopy = notasFinalesReduce;
		this.visible = true;
		this.notasService.getNotasById(idParticpanteNota).subscribe((data) => {
			this.notas = data;
			this.idCapModelEdit = this.notas.idNota;
		});
	}

	public guardarNotaPorEstudiante(): void {
		if (!this.notas.informe1 || !this.notas.informe2 || !this.notas.informe3 || !this.notas.examenFinal) {
			this.toastrService.error(
				'Debe ingresar todas las notas: Informe 1, Informe 2, Informe 3 y Examen Final.',
				'NOTAS VACIAS.',
				{
					timeOut: 2000,
				}
			);
		} else {
			this.notasService
				.updateNotas(this.idCapModelEdit!, this.notas)
				.subscribe((data) => {

					const { idNota, informe1, informe2, informe3, examenFinal, observacion, fechaNota, partipantesMatriculados } = data;
					const idParticipanteMatriculado = partipantesMatriculados?.idParticipanteMatriculado
					const result = { ...this.notaFinalReduceCopy, idNota, informe1, informe2, informe3, examenFinal, observacion, fechaNota, idParticipanteMatriculado }

					const index = this.notasFinalesReduce.findIndex(i => i.idNota === result.idNota);
					this.notasFinalesReduce[index] = result;

					this.chartParticipantes();

					this.notaFinalReduceCopy = {} as NotaFinalReduce;

					this.toastrService.success(
						'Nota ingresada del alumno correctamente.',
						'NOTAS INGRESADAS.',
						{
							timeOut: 2000,
						}
					);

					this.visible = false;
					this.updateStatusAproved(idParticipanteMatriculado!, informe1!, informe2!, informe3!, examenFinal!);
				});
		}
	}

	public updateStatusAproved(id: number, nota1: number, nota2: number, nota3: number, nota4: number) {
		const notaFinal = this.validarNotasFinalesView(nota1, nota2, nota3, nota4);
		this.participantesMatriculadosService.updateEstadoAprobacionParticipanteMatriculado(id, notaFinal >= 70 ? 'A' : 'R').subscribe({
			next: (resp) => {

			}
		})
	}

	// VALIDAR LAS NOTAS FINALES
	// A:APROBADOS R:REPROBADOS X:RETIRADOS
	public participantesMatriculado: ParticipantesMatriculados =
		new ParticipantesMatriculados();

	public idParticpanteNota!: number;
	public vaidarNotasEstudiantesFinales() {
		let informe1CeroVacio = false;
		let informe2CeroVacio = false;
		let informe3CeroVacio = false;
		let examenFinalCeroOVacio = false;

		this.notasFinalesReduce.forEach((nota) => {
			if (!nota.informe1) {
				informe1CeroVacio = true;
			}
			if (!nota.informe2) {
				informe2CeroVacio = true;
			}
			if (!nota.informe3) {
				informe3CeroVacio = true;
			}
			if (!nota.examenFinal) {
				examenFinalCeroOVacio = true;
			}
		});

		if (informe1CeroVacio || informe2CeroVacio || informe3CeroVacio || examenFinalCeroOVacio) {
			this.toastrService.error(
				'Debe ingresar todas las notas de los estudiantes, y no deben ser cero.',
				'NOTAS INCOMPLETAS'
			);
			return;
		}

		this.finalizarCursoCapacitacionContinua();
	}

	public validarNotasFinalesView(nota1: number, nota2: number, nota3: number, notafinal: number) {
		return (nota1 / 30) * 30 + (nota2 / 30) * 30 + (nota3 / 15) * 15 + (notafinal / 25) * 25;
	}

	public generarReporteAsitenciaEvaluacion(): void {
		this.resportService
			.downloadAsistenciaEvaluacion(this.idCursoGlobal!)
			.subscribe((r) => {
				const url = URL.createObjectURL(r);
				window.open(url, '_blank');
			});
	}

	public generarReporteParticipantes(): void {
		this.resportService
			.downloadInformeFinalParticipantesCurso(this.idCursoGlobal!)
			.subscribe((r) => {
				const url = URL.createObjectURL(r);
				window.open(url, '_blank');
			});
	}

	//INFORME FINAL
	public generarReporteInformeFinalCurso(): void {
		this.resportService
			.downloadInformeFinalCurso(this.idCursoGlobal!)
			.subscribe((r) => {
				const url = URL.createObjectURL(r);
				window.open(url, '_blank');
			});
	}

	//IMPLEMENTACION PARA QUE LLENE EL FORMULARIO FINAL DE CURSO..

	public visibleModalFormFinalCourse?: boolean = false;

	// EDIT AND CREATE RESULTADOS //
	public classInformeFinalC = new InformeFinalCurso();

	public showModalFinalInformationCorse() {
		this.visibleModalFormFinalCourse = true;
	}

	public traerInformeFinalCurso() {
		this.informeFinalCorseService
			.getInformeFinalCursoByIdCurso(this.idCursoGlobal!)
			.subscribe(
				(data) => {
					if (data != null) {
						this.classInformeFinalC = data;
						this.classInformeFinalC.idInformeFinalCurso =
							data.idInformeFinalCurso;
					}
				},
				(err) => {
					this.toastrService.info(
						'Listo para llenar el informe final.',
						'INFORME FINAL.',
						{
							timeOut: 2000,
						}
					);
				}
			);
	}

	public valida() {
		this.informeFinalCorseService
			.getInformeFinalCursoByIdCurso(this.idCursoGlobal!)
			.subscribe(
				(data) => {
					if (data != null) {
						this.classInformeFinalC = data;
						this.classInformeFinalC.idInformeFinalCurso =
							data.idInformeFinalCurso;
					}
				},
				(err) => {
					this.toastrService.info(
						'Listo para llenar el informe final.',
						'INFORME FINAL.',
						{
							timeOut: 2000,
						}
					);
				}
			);
	}

	public validarCamposVaciosInformeFinal() {
		if (
			!this.classInformeFinalC.observacionesInformeFinalCurso ||
			!this.classInformeFinalC.lugarInformeFinalCurso ||
			!this.classInformeFinalC.nombreCantonInformeFinalCurso
		) {
			this.toastrService.error(
				'Debe llenar todos los campos.',
				'CAMPOS VACÍOS.',
				{
					timeOut: 2000,
				}
			);
		} else {
			this.saveUpdateInformFinalCourse();
		}
	}

	public saveUpdateInformFinalCourse() {
		this.classInformeFinalC = { ...this.classInformeFinalC };
		if (this.classInformeFinalC.idInformeFinalCurso) {
			this.informeFinalCorseService
				.updateInformeFinalCurso(
					this.classInformeFinalC.idInformeFinalCurso,
					this.classInformeFinalC
				)
				.subscribe((data) => {
					if (data != null) {
						this.toastrService.success(
							'Datos del informe final actualizados.',
							'DATOS ACTUALIZADOS.',
							{
								timeOut: 2000,
							}
						);
						this.classInformeFinalC = data;
					}
				});
		} else {
			this.classInformeFinalC.curso = this.classCursoFinalizaEstado;
			this.informeFinalCorseService
				.saveInformeFinalCurso(this.classInformeFinalC)
				.subscribe((data) => {
					if (data != null) {
						// alert('succesful');
						this.toastrService.success(
							'Datos del informe final almacenados correctamente.',
							'INFORME CREADO.',
							{
								timeOut: 2000,
							}
						);
						this.classInformeFinalC = data;
					}
				});
		}
	}


	//PRIME PAGINATOR------------------------------------------------------------------------------------
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
		return this.notasFinalesReduce
			? this.first === this.notasFinalesReduce.length - this.rows
			: true;
	}

	public isFirstPage(): boolean {
		return this.notasFinalesReduce ? this.first === 0 : true;
	}
	//END PRIME PAGINATOR------------------------------------------------------------------------------------

	public validarParcialAndFinalNota(event: any) {
		const valor = parseInt(event.target.value, 10);

		if (event.target.id === 'informe1') {
			if (valor < 1 || valor > 30) {
				this.toastrService.error('La nota del INFORME 1 debe estar en el rango de 1 a 30');
				event.target.value = '';
			}
		} else if (event.target.id === 'informe2') {
			if (valor < 1 || valor > 30) {
				this.toastrService.error('La nota  del INFORME 2 debe estar en el rango de 1 a 30');
				event.target.value = '';
			}
		} else if (event.target.id === 'informe3') {
			if (valor < 1 || valor > 15) {
				this.toastrService.error('La nota  del INFORME 3 debe estar en el rango de 1 a 15');
				event.target.value = '';
			}
		} else if (event.target.id === 'examenFinal') {
			if (valor < 1 || valor > 25) {
				this.toastrService.error('La nota del EXAMEN debe estar en el rango de 1 a 25');
				event.target.value = '';
			}
		}
	}

	public validarEntrada(event: any): void {
		const tecla = event.keyCode || event.which;
		const valor = event.target.value;

		// Verificar si el valor contiene solo uno o dos ceros
		if (/^0{1,2}$/.test(valor) && (tecla === 48 || tecla === 96)) {
			this.toastrService.warning('No se permiten valores de este tipo.');
			event.preventDefault(); // Evitar la entrada de uno o dos ceros
		}
	}

	public cancelNotaSave() {
		this.visible = false
	}

	//IMPLEMENTS CHART
	public chartParticipantes() {
		const notas = this.notasFinalesReduce.map(i => {
			const informe1 = i.informe1 || 0;
			const informe2 = i.informe2 || 0;
			const informe3 = i.informe3 || 0;
			const examenFinal = i.examenFinal || 0;

			return ((informe1 / 30) * 30 + (informe2 / 30) * 30 + (informe3 / 15) * 15 + (examenFinal / 25) * 25);
		});

		const inform = notas.reduce((conteo, nota) => {

			nota >= 70 ? conteo[0].y++ : nota === 0 ? conteo[2].y++ : conteo[1].y++;
			conteo[3].y++;

			return conteo;
		}, [
			{ name: 'Aprobados', y: 0 },
			{ name: 'Reprobados', y: 0 },
			{ name: 'Pendiente', y: 0 },
			{ name: 'Total', y: 0 }
		]);

		this.rendererChart(inform);
	}

	Highcharts: typeof Highcharts = Highcharts;
	chartOptions!: Highcharts.Options;

	public rendererChart(inform: any) {
		this.chartOptions = {
			chart: {
				type: 'pie'
			},
			title: {
				text: 'REPORTE DE ESTUDIANTES'
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
