import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { CursoService } from 'src/app/service/curso.service';
import { DisenioCurricularService } from 'src/app/service/disenio-curricular.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { SilaboService } from 'src/app/service/silabo.service';
import { FOLDER_IMAGE_USER, getFile } from 'src/app/util/folder-upload';
import { EmailCourseApproved } from 'src/app/util/model/email-course-approved';
import { EmailService } from 'src/app/service/email/email.service';
import { ListCourseReduce } from 'src/app/models/references/list-course-reduce';

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

	public listCursos: ListCourseReduce[] = [];

	//Método que me va servir para impplementar los periodos de programas
	public statuses: any[] = [];

	public loading: boolean = false;

	public activityValues: number[] = [0, 100];

	private sanitizer!: DomSanitizer;

	constructor(
		private cursoService: CursoService,
		sanitizer: DomSanitizer,
		private reportService: ReportsCapacitacionesService,
		private disenioService: DisenioCurricularService,
		private silaboService: SilaboService,
		private toastrService: ToastrService,
		private emailService: EmailService
	) {
		this.sanitizer = sanitizer;
	}
	ngOnInit(): void {

		this.obtenerTodosLosCursos();
	}

	public clear(table: Table) {
		table.clear();
	}

	public obtenerTodosLosCursos() {

		this.cursoService.findByAllCourseDataReducePageable(0, 5, ["idCurso", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'CURSOS OBTENIDOS');
				this.listCursos = resp.content;

				this.listCursos.forEach(
					(curso) =>
						(curso.fechaInicio = new Date(curso.fechaInicio!))
				);
				this.listCursos.forEach(
					(curso) =>
					(curso.fechaFin = new Date(
						curso.fechaFin!
					))
				);

				this.dataSizeRequest(resp.totalElements);
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER CURSOS');
			}
		});

	}

	//IMPLEMENTACION PARA HACER QUE EL CURSO SE ACEPTE
	public classCursoValidanew = new ListCourseReduce();
	public visibleCursoDeCapacitacion?: boolean;
	public validarHojaDeVida(curso: ListCourseReduce, caso: number) {
		this.pdfSrc = null;
		this.classCursoValidanew = { ...curso };

		this.obtenerReportesValidacion(caso, curso.idCurso!);
		this.visibleCursoDeCapacitacion = true;
	}

	//-----------------------------------------------------------------------------------------------------------------------------------------------
	public emailCourseApproved = new EmailCourseApproved();

	//-----------------------------------------------------------------------------------------------------------------------------------------------

	public UpdateValidacionCurso(idCurso: number) {
		 this.emailCourseApproved.receptor = this.classCursoValidanew.email;
		//this.emailCourseApproved.receptor = 'javiertimbe100@gmail.com';
		this.emailCourseApproved.nameCourse = this.classCursoValidanew.nameCourse;
		this.emailCourseApproved.topic = 'Curso "' + this.classCursoValidanew.nameCourse + (idCurso === 1 ? '" Aprobado' : '" No aceptado');
		const fullName = this.classCursoValidanew.docente
		this.emailCourseApproved.sumary = 'Estimado, ' + (fullName) + ' le informo que su curso "' + (this.classCursoValidanew.nameCourse) + '"';
		this.emailCourseApproved.status = idCurso === 1 ? true : false;

		this.sendEmailVerification = true;

	}

	public principalAcceptDataAndUpdate() {
		this.classCursoValidanew.statusApproved = this.emailCourseApproved.status ? 'A' : 'R';

		this.cursoService.updateStatusCourseAcepted(this.classCursoValidanew.idCurso!, this.classCursoValidanew.statusApproved).subscribe({
			next: (resp) => {
				console.log(resp)
				const index = this.listCursos.findIndex(i => i.idCurso === resp.idCurso);
				this.listCursos[index] = this.classCursoValidanew;

				this.emailService.sendEmailApprovedCourse(this.emailCourseApproved);
				setTimeout(() => {
					this.cleanDataSendEmailAndUpdate();
				}, 1000);
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE, INTÉNTELO MÁS TARDE');
			}
		});
	}

	public cleanDataSendEmailAndUpdate() {
		this.sendEmailVerification = false;
		this.visibleCursoDeCapacitacion = false;
		this.emailCourseApproved = {} as EmailCourseApproved;
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
		size >= 30 ? this.options.push({ label: '30', value: 30 }) : null;
		size >= 50 ? this.options.push({ label: '50', value: 50 }) : null;
		size >= 100 ? this.options.push({ label: '100', value: 100 }) : null;
		size >= 200 ? this.options.push({ label: '200', value: 200 }) : null;
		this.options.push({ label: 'TODO', value: size })
	}

	public rows2: number = 5;

	public getPaginatorValidateCoursesCapacitacion(size: any) {

		this.cursoService.findByAllCourseDataReducePageable(0, size, ["idCurso", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'TAMAÑO DE CURSOS SOLICITADOS: ' + size);
				this.listCursos = resp.content;

				this.listCursos.forEach(
					(curso) =>
						(curso.fechaInicio = new Date(curso.fechaInicio!))
				);
				this.listCursos.forEach(
					(curso) =>
					(curso.fechaFin = new Date(
						curso.fechaFin!
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

	public visibleEmailDataUpdate() {
		this.sendEmailVerification = false;
	}
}
