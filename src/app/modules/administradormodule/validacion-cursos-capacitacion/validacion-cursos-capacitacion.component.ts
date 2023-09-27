import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { Curso } from 'src/app/models/curso';
import { HojaVidaCapacitador } from 'src/app/models/hoja-vida-capacitador';
import { Persona } from 'src/app/models/persona';
import { Programas } from 'src/app/models/programa';
import { Usuario } from 'src/app/models/usuario';
import { CursoService } from 'src/app/service/curso.service';
import { DisenioCurricularService } from 'src/app/service/disenio-curricular.service';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { PersonaService } from 'src/app/service/persona.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { SilaboService } from 'src/app/service/silabo.service';
import { FOLDER_IMAGE_USER, getFile } from 'src/app/util/folder-upload';

@Component({
	selector: 'app-validacion-cursos-capacitacion',
	templateUrl: './validacion-cursos-capacitacion.component.html',
	styleUrls: [
		'./validacion-cursos-capacitacion.component.css',
		'./validacion-cursos-capacitacion.component.scss',
	],
})
export class ValidacionCursosCapacitacionComponent implements OnInit {


	//Declaracion de las clases que vamos a usar

	public listP: Persona[] = [];

	public listCursos: Curso[] = [];

	//Método que me va servir para impplementar los periodos de programas
	statuses: any[] = [];

	loading: boolean = false;

	activityValues: number[] = [0, 100];

	private sanitizer!: DomSanitizer;

	constructor(
		private periodoProgramaService: PeriodoProgramaService,
		private programaService: ProgramasService,
		private P: PersonaService,
		private cursoService: CursoService,
		private userService: UsuarioService,
		private hojaVidaService: HojaVidaCapacitadorService,
		sanitizer: DomSanitizer,
		private reportService: ReportsCapacitacionesService,
		private disenioService: DisenioCurricularService,
		private silaboService: SilaboService,
		private toastrService: ToastrService
	) {
		this.sanitizer = sanitizer;
	}
	ngOnInit(): void {

		this.obtenerTodosLosCursos();
	}

	clear(table: Table) {
		table.clear();
	}

	//Implementtacion de lso metodos para validar los cursos

	public obtenerTodosLosCursos() {

		this.cursoService.findByAllPaginator(0, 5, ["idCurso", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'CURSOS OBTENIDOS');
				this.listCursos = resp.content;

				this.listCursos.forEach(
					(curso) =>
						(curso.fechaInicioCurso = new Date(curso.fechaInicioCurso!))
				);
				this.listCursos.forEach(
					(curso) =>
					(curso.fechaFinalizacionCurso = new Date(
						curso.fechaFinalizacionCurso!
					))
				);

				this.dataSizeRequest(resp.totalElements);
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER CURSOS');
			}
		});

	}

	//IMPLEMENTACION PARA HACER QUE EL CURSO SE ACEPTE
	public classCursoValidanew = new Curso();
	visibleCursoDeCapacitacion?: boolean;
	public validarHojaDeVida(curso: Curso, caso: number) {
		this.pdfSrc = null;
		this.classCursoValidanew = { ...curso };

		this.obtenerReportesValidacion(caso, curso.idCurso!);
		this.visibleCursoDeCapacitacion = true;
	}

	public UpdateValidacionCurso(idCurso: number) {
		this.sendEmailVerification = true;

		// if (idCurso === 1) {
		// 	this.classCursoValidanew.estadoAprovacionCurso = 'A';
		// } else {
		// 	this.classCursoValidanew.estadoAprovacionCurso = 'R';
		// }
		// this.cursoService
		// 	.updateCurso(this.classCursoValidanew.idCurso!, this.classCursoValidanew)
		// 	.subscribe((data) => {
		// 		if (data != null) {
		// 			if (data.estadoAprovacionCurso === 'A') {
		// 				this.toastrService.success('Curso aprovado', 'CURSO APROVADO');
		// 			} else {
		// 				this.toastrService.error(
		// 					'El curso a sido rechazado.',
		// 					'CURSO RECHAZADO'
		// 				);
		// 			}
		// 		}
		// 	});
		// setTimeout(() => {
		// 	location.reload();
		// }, 1300);
	}

	public pdfSrc: any;
	public obtenerReportesValidacion(caso: number, idCurso: number) {
		switch (caso) {
			case 1:
				this.silaboService.getSilaboByIdPC(idCurso).subscribe((data) => {
					if (data != null) {
						this.reportService
							.gedownloadSilabo(data.idSilabo!)
							.subscribe((data) => {
								if (data != null) {
									const url = URL.createObjectURL(data);
									this.pdfSrc =
										this.sanitizer.bypassSecurityTrustResourceUrl(url);
								}
							});
					}
				});

				break;

			case 2:

				this.reportService
					.getDownloadReportNecesidadCurso(idCurso)
					.subscribe((data) => {
						if (data != null) {
							const url = URL.createObjectURL(data);
							this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
						}
					});
				break;

			case 3:
				this.disenioService
					.getDisenioCurricularPorSilaboCursoById(idCurso)
					.subscribe(
						(data) => {
							if (data != null) {
								this.reportService
									.downloadDisenioCurricular(data.idDisenioCurricular!)
									.subscribe((data) => {
										if (data != null) {
											const url = URL.createObjectURL(data);
											this.pdfSrc =
												this.sanitizer.bypassSecurityTrustResourceUrl(url);
										}
									});
							}
						},
						(err) => {
							this.toastrService.error(
								'Este curso no tiene diseño curricular',
								'NO HAY DISEÑO CURRICULAR'
							);
						}
					);

				break;
		}
	}

	//NUEVOS MÉTODOS--------------------------------------------------------------------------------
	public options = [
		{ label: '5', value: 5 },
	];

	public dataSizeRequest(size: number) {
		size >= 10 ? this.options.push({ label: '10', value: 10 }) : null;
		size >= 15 ? this.options.push({ label: '15', value: 15 }) : null;
		size >= 20 ? this.options.push({ label: '20', value: 20 }) : null;
		this.options.push({ label: 'TODO', value: size })
	}

	public rows2: number = 5;

	public getPaginatorValidateCoursesCapacitacion(size: any) {

		this.cursoService.findByAllPaginator(0, size, ["idCurso", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'TAMAÑO DE CURSOS SOLICITADOS: ' + size);
				this.listCursos = resp.content;

				this.listCursos.forEach(
					(curso) =>
						(curso.fechaInicioCurso = new Date(curso.fechaInicioCurso!))
				);
				this.listCursos.forEach(
					(curso) =>
					(curso.fechaFinalizacionCurso = new Date(
						curso.fechaFinalizacionCurso!
					))
				);
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER CURSOS');
			}
		});
	}

	//------------------------------------------------------------------------------------
	public sendEmailVerification: boolean = false;

	//---------------------------------------------------
	public getImage(key: string): string {
		return getFile(key, FOLDER_IMAGE_USER);
	}
}
