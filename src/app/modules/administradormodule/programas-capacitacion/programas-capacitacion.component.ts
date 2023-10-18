import { Component, OnInit } from '@angular/core';
import { PeriodoPrograma } from 'src/app/models/periodo-programa';
import { Programas } from 'src/app/models/programa';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ToastrService } from 'ngx-toastr';

import * as Highcharts from 'highcharts';

import HC_exporting from 'highcharts/modules/exporting';

import drilldown from 'highcharts/modules/drilldown';
import { ChartProgramaCourse } from 'src/app/models/references/chart-programa.course';
import { forkJoin } from 'rxjs';
drilldown(Highcharts);

HC_exporting(Highcharts);


@Component({
	selector: 'app-programas-capacitacion',
	templateUrl: './programas-capacitacion.component.html',
	styleUrls: ['./programas-capacitacion.component.css'],
})
export class ProgramasCapacitacionComponent implements OnInit {

	// Declaración de las listas para tener el registro de los programas
	// public listaDeProgramas: PeriodoPrograma[] =[];
	public listaProgramas: Programas[] = [];

	// Declaración de las clases que vamos a usar
	public classPeriodoPrograma = new PeriodoPrograma();
	public classPrograma = new Programas();

	constructor(
		private periodoProgramaService: PeriodoProgramaService,
		private programaService: ProgramasService,
		private toastrService: ToastrService
	) { }

	ngOnInit(): void {
		this.getTodosLosProgramasPorAdministrador();
		this.getChartProgram();
	}

	public validarDatosProgramaCapacitacionContinua() {
		if (
			!this.classPeriodoPrograma.nombrePeriodoPrograma ||
			!this.classPeriodoPrograma.nombrePeriodoPrograma ||
			!this.classPrograma.nombrePrograma ||
			!this.classPrograma.descripcionPrograma
		) {
			this.toastrService.error(
				'Verifique los campos que no estén vacíos.',
				'CAMPOS VACÍOS.',
				{
					timeOut: 1300,
				}
			);
		} else {
			this.createPrograma();
		}
	}

	public hideDialog() {
		this.visible = false;
		this.submitted = false;
	}

	public createPrograma() {
		if (this.classPeriodoPrograma.idPeriodoPrograma) {
			this.periodoProgramaService
				.updatePeriodoPrograma(
					this.classPeriodoPrograma.idPeriodoPrograma,
					this.classPeriodoPrograma
				)
				.subscribe((data) => {
					if (data != null) {
						this.programaService
							.updatePrograma(
								this.classPrograma.idPrograma!,
								this.classPrograma
							)
							.subscribe((data) => {
								this.listaProgramas = this.listaProgramas.map((i) => (i.idPrograma === data.idPrograma ? data : i))
								this.callChartProgramas();
								this.toastrService.success(
									'Se ha actualizado correctamente el programa de capacitación.',
									'ACTUALIZACIÓN EXITOSA.',
									{
										timeOut: 1500,
									}
								);
								this.cleanData();
								this.visible = false;

							});
					}
				});
		} else {
			this.classPeriodoPrograma.estadoPeriodoPrograma = true;
			this.periodoProgramaService
				.savePeriodoPrograma(this.classPeriodoPrograma)
				.subscribe((data) => {
					if (data != null) {
						this.classPrograma.periodoPrograma = data;
						this.classPrograma.estadoProgramaActivo = true;
						this.programaService
							.savePrograma(this.classPrograma)
							.subscribe((data) => {
								this.listaProgramas.push(data);
								this.callChartProgramas();

								this.cleanData();
								this.toastrService.success(
									'Se ha creado correctamente el programa de capacitación.',
									'CREACIÓN EXITOSA.',
									{
										timeOut: 1500,
									}
								);
								this.visible = false;

							});
					}
				});
		}
	}

	public getTodosLosProgramasPorAdministrador() {
		this.programaService.listPrograma().subscribe({
			next: (resp) => {
				this.listaProgramas = resp;
				this.callChartProgramas();

			}, error: (err) => {

			}
		});
	}

	public listChartProgramCourse: ChartProgramaCourse[] = [];
	public getChartProgram() {
		this.programaService.chartProgramaC().subscribe({
			next: (resp) => {
				this.listChartProgramCourse = resp;
			}, error: (err) => {

			}
		})

	}

	public cleanData() {
		this.classPeriodoPrograma = {} as PeriodoPrograma;
		this.classPrograma = {} as Programas;
	}

	//Lo que vamos hacer es el eliminado lógico.
	public updateProgramasEliminadoLogico(programa: Programas) {
		// programa.estadoProgramaActivo = true;
		programa.estadoProgramaActivo = !programa.estadoProgramaActivo; // Alternar el estado activo/desactivado
		this.programaService
			.updatePrograma(programa.idPrograma!, programa)
			.subscribe((data) => {
				if (data != null) {
					this.getTodosLosProgramasPorAdministrador();
					if (programa.estadoProgramaActivo) {
						this.toastrService.success(
							'El programa ya esta público',
							'Activación Exitosa'
						);
					} else {
						this.toastrService.warning(
							'El programa a sido  acultado',
							'Desactivación Exitosa'
						);
					}
				}
			});
	}

	//Vamos a actualizar

	public cargarDatos(programa: Programas) {
		this.classPrograma = { ...programa };
		this.classPeriodoPrograma = this.classPrograma.periodoPrograma!;
		this.visible = true;
	}


	visible?: boolean;
	submitted: boolean = false;

	public showModaL() {
		this.visible = true;
		this.cleanData();

	}


	//-----------------------
	//IMPLEMENTS CHART
	public callChartProgramas() {
		const totalPorcentaje = 100;
		const nameProgram = this.listaProgramas.map((i) => {
			const porcentaje = totalPorcentaje / this.listaProgramas.length
			return {
				name: i.nombrePrograma,
				y: porcentaje,
				drilldown: i.nombrePrograma
			}
		});

		//SUB
		const programas = Array.from(new Set(this.listChartProgramCourse.map(item => item.nombrePrograma)));

		const series = programas.map(programa => {
			const cursosAsociados = this.listChartProgramCourse
				.filter(item => item.nombrePrograma === programa)
				.map(item => [item.nombreCurso, item.numeroCuposCurso]);

			return {
				name: programa,
				id: programa,
				type: 'pie',
				data: cursosAsociados
			};
		});

		this.rendererGenderChart(nameProgram, series);
	}


	Highcharts: typeof Highcharts = Highcharts;
	chartOptions!: Highcharts.Options;

	public rendererGenderChart(inform: any, data: any) {
		this.chartOptions = {
			chart: {
				type: 'pie'
			},
			title: {
				text: 'REPORTE DE PROGRAMAS DE CAPACITACIÓN '
			},

			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y:.1f}%'
					},
					showInLegend: true,
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				// pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> cupos en total<br/>',
			},
			series: [
				{
					name: 'Equivalente',
					type: 'pie',
					data: inform as [],
					id: 'main-pie'

				}
			],
			drilldown: {
				series: data
			},
		};

	}

}

