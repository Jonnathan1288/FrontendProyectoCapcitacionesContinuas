import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Capacitador } from 'src/app/models/capacitador';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/service/curso.service';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

@Component({
	selector: 'app-list-course',
	templateUrl: './list-course.component.html',
	styleUrls: ['./list-course.component.css'],
})
export class ListCourseComponent implements OnInit {
	public curso = new Curso();
	public capacitador = new Capacitador();
	public items: any;
	public cursoList: Curso[] = [];

	first = 0;
	layout: string = 'list';
	rows = 5;

	public idUsuarioIsLoggin: any;
	public idCapacitador: any;
	constructor(
		private cursoService: CursoService,
		private router: Router,
		private toastrService: ToastrService
	) { }

	ngOnInit(): void {
		this.idUsuarioIsLoggin = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
		this.listCourseporUsuarioLogin();
	}

	public idCapClicl!: number;
	capId(idCurso: number) {
		alert(idCurso);
		this.idCapClicl = idCurso;
	}

	public listCourseporUsuarioLogin() {

		this.cursoService.findByCapacitadorUsuarioIdUsuarioPageable(this.idUsuarioIsLoggin!, 0, 5, ["idCurso", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'CURSOS OBTENIDOS');
				this.cursoList = resp.content;
				this.dataSizeRequest(resp.totalElements);
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER CURSOS');
			}
		});
	}

	//Actualizar el curso para que sea publico
	public updateEstadoPublico(curso: Curso) {
		curso.estadoPublicasionCurso = 'V';
		curso.estadoCurso = true;
		console.log({ datapreview: curso });
		this.cursoService.updateCurso(curso.idCurso!, curso).subscribe((data) => {
			if (data != null) {
				console.log({ json: data });
				alert('Succesful published');
			}
		});


	}

	//IMPLEMENTACION DEL MODAL PARA VISULIZAR
	public visibleCursoPublicar?: boolean = false;
	public cursoViewPublished = new Curso();
	// public palabras: any;
	public showModaLPublisedCourse(curso: Curso) {
		this.cursoViewPublished = { ...curso };
		this.visibleCursoPublicar = true;
	}

	public closeModalView() {
		this.visibleCursoPublicar = false;
	}

	//IMPLEMENTACION PARA LA IDICIÓN DEL CURSO-------------------------------------
	public editarCursoCapacitadionContinua() {
		this.router.navigate(['/register/course', this.cursoViewPublished.idCurso]);
	}

	public updatePublicCursosCapacitacion() {
		this.cursoViewPublished.estadoPublicasionCurso = 'V';
		this.cursoViewPublished.estadoCurso = true;
		this.cursoService
			.updateCurso(this.cursoViewPublished.idCurso!, this.cursoViewPublished)
			.subscribe((data) => {
				if (data != null) {
					this.toastrService.success(
						'Publicando',
						'Publicasión del curso éxitosa',
						{
							timeOut: 1500,
							progressBar: true,
							progressAnimation: 'increasing',
						}
					);
					setTimeout(() => {
						window.location.reload();
					}, 1500);
				}
			});
	}

	public visiblePeriodoMensual?: boolean = false;
	public classNewCourse = new Curso();
	public modalViewoption(curso: Curso) {
		this.classNewCourse = { ...curso };
		this.visiblePeriodoMensual = true;
	}

	public newCursoCapcitacion() {
		this.router.navigate(['/register/course']);
	}


	public editCurso(idcurso: number) {
		this.router.navigate(['/register/course', idcurso]);
	}

	public VerParticipantesInscritos(idCurso: number) {
		this.router.navigate(['/verInscritos/course/', idCurso]);
	}

	public editarCurso() {
		this.router.navigate(['/register/course', this.classNewCourse.idCurso]);
	}

	public necesidadCurso() {
		this.router.navigate(['/register/necesidad', this.classNewCourse.idCurso]);
	}

	public generacionSilaboCurso() {
		this.router.navigate(['/silabo', this.classNewCourse.idCurso]);
	}

	public reistroFotograficoCurso() {
		this.router.navigate([
			'/registro/fotografico/curso/',
			this.classNewCourse.idCurso,
		]);
	}

	public clear(table: Table) {
		table.clear();
	}

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

	public getPaginatorCourses(size: any) {

		this.cursoService.findByCapacitadorUsuarioIdUsuarioPageable(this.idUsuarioIsLoggin!, 0, size, ["idCurso", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'TAMAÑO DE CURSOS SOLICITADOS: ' + size);
				this.cursoList = resp.content;
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER CURSOS');
			}
		});
	}
}
