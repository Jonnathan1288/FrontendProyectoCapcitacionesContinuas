import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { Usuario } from 'src/app/models/usuario';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { CursoService } from 'src/app/service/curso.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { LocalStorageKeys, getAttributeStorage, getRole } from 'src/app/util/local-storage-manager';
import * as Highcharts from 'highcharts';

import HC_exporting from 'highcharts/modules/exporting';
import { CourseFilterDocente } from 'src/app/models/references/course-filter-by-docente';
import { SecurityService } from 'src/app/util/service/security.service';

HC_exporting(Highcharts);

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
	public idUsuarioIsLoggin: any;
	public rolNameUser?: any;

	// public cursoList: Curso[] = [];

	constructor(
		private usuarioService: UsuarioService,
		private cursoService: CursoService,
		private capacitadorService: CapacitadorService,
		private router: Router,
		private toastrService: ToastrService,
		private securityService: SecurityService
	) { }

	ngOnInit(): void {
		this.idUsuarioIsLoggin = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
		this.obternerDatosUsuarioLoggin(this.idUsuarioIsLoggin);
		this.rolNameUser = getRole(LocalStorageKeys.ROL);
		this.listCourseporUsuarioLogin(this.idUsuarioIsLoggin);

		if (this.rolNameUser === 'DocenteCapacitador') {
			this.capacitadorService
				.getCapacitadorByUsuarioIdUsuario(this.idUsuarioIsLoggin)
				.subscribe((data) => {
					if (data != null) {
						console.log(data);
						if (
							!data.tituloCapacitador ||
							// Ususuario
							!data.usuario?.persona?.apellido1
						) {
							// localStorage.setItem("emp", 'EMPTY');
							const empty = 'EMPTY'
							localStorage.setItem(
								'emp',
								String(this.securityService.encrypt(empty))
							);
							setTimeout(() => {
								this.toastrService.info('', 'INGRESE SUS DATOS');
							}, 500);
							location.replace('/user/edit/data');
						}
					}
				});
		}
	}

	public cursoList: CourseFilterDocente[] = []
	public listCourseporUsuarioLogin(idUsuario: number) {

		this.cursoService
			.findFilterCoursesByUsuarioDocente(idUsuario)
			.subscribe((data) => {
				this.cursoList = data;

				this.chartParticipantes()
				// const l = cursoList.
			});
	}

	usuario: Usuario = new Usuario();

	public obternerDatosUsuarioLoggin(idUsuarioLogin: number): void {
		this.usuarioService.getUsuarioById(idUsuarioLogin).subscribe((data) => {
			this.usuario = data;

			// en el caso para el participante
			if (this.rolNameUser === 'Participante') {
				if (
					// Ususuario
					!this.usuario?.persona?.apellido1
				) {
					const empty = 'EMPTY'
					localStorage.setItem(
						'emp',
						String(this.securityService.encrypt(empty))
					);
					setTimeout(() => {
						this.toastrService.info('', 'DATOS INCOMPLETOS');
					}, 500);
					location.replace('/user/edit/data');
				}
			}
		});
	}

	verCursos() {
		this.router.navigate(['cards/course']).then(() => {
			// window.location.reload();
		});
	}

	//IMPLEMENTS CHART
	public chartParticipantes() {

		const reduce = this.cursoList.reduce((reduce, i) => {

			if (i.estadoPublicasionCurso === 'I') {
				reduce[1].y++;
			} else if (i.estadoPublicasionCurso === 'V') {
				reduce[2].y++;
			} else if (i.estadoPublicasionCurso === 'F') {
				reduce[3].y++;
			}
			if (i.estadoAprovacionCurso === 'A') {
				reduce[4].y++;
			}
			if (i.estadoAprovacionCurso === 'P') {
				reduce[5].y++;
			}
			if (i.estadoAprovacionCurso === 'R') {
				reduce[6].y++;
			}
			reduce[0].y++;

			return reduce;
		}, [{ name: 'Total', y: 0 },
		{ name: 'Iniciados', y: 0 },
		{ name: 'Publicados', y: 0 },
		{ name: 'Finalizados', y: 0 },
		{ name: 'Aprobados', y: 0 },
		{ name: 'Pendientes en aprobar', y: 0 },
		{ name: 'Rechazados', y: 0 },
		])

		this.rendererGenderChart(reduce);
	}


	Highcharts: typeof Highcharts = Highcharts;
	chartOptions!: Highcharts.Options;

	public rendererGenderChart(inform: any) {
		this.chartOptions = {
			chart: {
				type: 'pie'
			},
			title: {
				text: 'GRÁFICA DE MIS ESTADOS DE CURSO'
			},

			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y} curso/s'
					},
					showInLegend: true,
				}
			},
			series: [
				{
					name: 'Equivalente',
					type: 'pie',

					data: inform
				}
			],
			colors: ['#E8289A ', '#F59E0B', '#1919FF', '#828E8C', '#22C55E', '#29AEB4', '#DC3030']
		};

	}
}
