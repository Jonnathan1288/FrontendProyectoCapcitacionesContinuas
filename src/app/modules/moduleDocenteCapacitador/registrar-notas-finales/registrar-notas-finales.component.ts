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

	public isValidateExistenciaNotas!: boolean;
	public validarExistenciaDeRegistros(): void {
		this.notasService
			.validarExistenciaDatos(this.idCursoGlobal!)
			.subscribe((data) => {
				if (data == false) {
					// SI HAY DATOS
					// alert('si hay');
					this.isValidateExistenciaNotas = false;
					this.obtenerParticipantesFinales();
				} else {
					// NO HAY DATOS
					// alert('no hay');
					this.isValidateExistenciaNotas = true;
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
	notas: Notas = new Notas();
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
	public listNotas: Notas[] = [];

	public obtenerParticipantesFinales(): void {
		this.notasService
			.getParticipantesFinales(this.idCursoGlobal!)
			.subscribe((data) => {
				this.listNotas = data;
				this.chartParticipantes();
			});
	}

	// CREAR NOTAS POR ESTUDIANTE

	/* MODAL */
	public visible?: boolean;
	public idCapModelEdit?: number;

	// EDIT AND CREATE RESULTADOS //
	public showModalNotas(idParticpanteNota: number) {
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
					this.notas = data;
					this.obtenerParticipantesFinales();
					this.toastrService.success(
						'Nota ingresada del alumno correctamente.',
						'NOTAS INGRESADAS.',
						{
							timeOut: 2000,
						}
					);

					this.visible = false;
				});
		}
	}

	// VALIDAR LAS NOTAS FINALES
	// A:APROBADOS R:REPROBADOS X:RETIRADOS
	public participantesMatriculado: ParticipantesMatriculados =
		new ParticipantesMatriculados();

	public idParticpanteNota!: number;
	public vaidarNotasEstudiantesFinales(): void {
		let informe1CeroVacio = false;
		let informe2CeroVacio = false;
		let informe3CeroVacio = false;
		let examenFinalCeroOVacio = false;

		this.listNotas.forEach((nota) => {
			if (nota.informe1 === 0 || nota.informe1 === undefined) {
				informe1CeroVacio = true;
			}
			if (nota.informe2 === 0 || nota.informe2 === undefined) {
				informe2CeroVacio = true;
			}
			if (nota.informe3 === 0 || nota.informe3 === undefined) {
				informe3CeroVacio = true;
			}
			if (nota.examenFinal === 0 || nota.examenFinal === undefined) {
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
		console.log('CLICk');
		for (let participante of this.listNotas) {

			const info1 = participante.informe1!;
			const info2 = participante.informe2!;
			const info3 = participante.informe3!;
			const examen = participante.examenFinal!;
			this.idParticpanteNota =
				participante.partipantesMatriculados!.idParticipanteMatriculado!;
			const notaFinal = (info1 / 30) * 30 + (info2 / 30) * 30 + (info3 / 15) * 15 + (examen / 25) * 25;
			console.log(' Esta es su nota final -> ' + notaFinal);

			this.participantesMatriculadosService
				.getParticipantesMatriculadosById(this.idParticpanteNota)
				.subscribe((data) => {
					this.participantesMatriculado = data;
					if (notaFinal >= 70) {
						console.log('APROBADO');
						this.participantesMatriculado.estadoParticipanteAprobacion = 'A';
					} else {
						console.log('NO APROBADO');
						this.participantesMatriculado.estadoParticipanteAprobacion = 'R';
					}
					this.participantesMatriculadosService
						.updateParticipantesMatriculados(
							this.idParticpanteNota,
							this.participantesMatriculado
						)
						.subscribe((data) => {
							console.log('Se actulizo su estado APROBACION');
						});
				});
		}

		this.toastrService.success(
			'Las notas se encuentran validadas.',
			'NOTAS VALIDADAS.',
			{
				timeOut: 2000,
			}
		);
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
						location.reload();
						// alert('succesful update');
						this.visibleModalFormFinalCourse = false;
					}
				});
		} else {
			this.classInformeFinalC.curso = this.classCursoFinalizaEstado;
			// this.classInformeFinalC.curso = data;
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
						location.reload();
						console.log({ cf: data });
					}
				});
		}
	}

	//implemeentacion

	//Implementacion de la tabla de todo referente a primeng
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
		return this.listNotas
			? this.first === this.listNotas.length - this.rows
			: true;
	}

	public isFirstPage(): boolean {
		return this.listNotas ? this.first === 0 : true;
	}

	public lastValidParcial: string = ''; // Variable para almacenar el último valor válido del campo

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

	//IMPLEMENTS CHART
	public data: any;
	public options: any;
	public chartParticipantes() {
		const notas = this.listNotas.map(i => {
			const informe1 = i.informe1 || 0;
			const informe2 = i.informe2 || 0;
			const informe3 = i.informe3 || 0;
			const examenFinal = i.examenFinal || 0;

			return ((informe1 / 30) * 30 + (informe2 / 30) * 30 + (informe3 / 15) * 15 + (examenFinal / 25) * 25);
		});

		const conteoNotas = notas.reduce((conteo, nota) => {

			nota > 70 ? conteo[0]++ : conteo[1]++;
			conteo[2]++;

			return conteo;
		}, [0, 0, 0]);


		const documentStyle = getComputedStyle(document.documentElement);
		const textColor = documentStyle.getPropertyValue('--text-color');

		this.data = {
			labels: ['APROBADOS', 'REPROBADOS', 'TOTAL'],
			datasets: [
				{
					data: conteoNotas,
					backgroundColor: [documentStyle.getPropertyValue('--green-600'), documentStyle.getPropertyValue('--yellow-600'), documentStyle.getPropertyValue('--blue-500')],
					hoverBackgroundColor: [documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--blue-400')]
				}
			]
		};

		this.options = {
			plugins: {
				legend: {
					labels: {
						usePointStyle: true,
						color: textColor
					}
				},

			}
		};
	}

}
