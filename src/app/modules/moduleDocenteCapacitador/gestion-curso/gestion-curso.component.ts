import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';
import { CourseFilter } from 'src/app/models/references/course-filter';
import { CourseFilterDocente } from 'src/app/models/references/course-filter-by-docente';
import { CursoService } from 'src/app/service/curso.service';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

@Component({
	selector: 'app-gestion-curso',
	templateUrl: './gestion-curso.component.html',
	styleUrls: ['./gestion-curso.component.css']
})
export class GestionCursoComponent implements OnInit {

	public idUsuarioIsLogin: any;

	public listCourseFilter: CourseFilterDocente[] = [];

	constructor(private cursoService: CursoService, private router: Router, private toastrService: ToastrService) {
	}

	ngOnInit(): void {
		this.idUsuarioIsLogin = getAttributeStorage(LocalStorageKeys.ID_USUARIO);

		this.findFilterCoursesByUsuarioDocente(this.idUsuarioIsLogin);
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

	public classCourseSelected = new CourseFilterDocente();
	public cursoSeleccionado: boolean = false;

	public cursoSeleccionadoChange(event: any) {
		const selectedOption = event.value;
		this.cursoSeleccionado = selectedOption !== null;
		this.classCourseSelected = selectedOption;
	}

	public cursoDeseleccionado() {
		this.cursoSeleccionado = false;
		this.classCourseSelected = new Curso();;
	}

	public navigateCourseRouter() {


		if (this.classCourseSelected && this.classCourseSelected.idCurso) {

			this.router.navigate(['/register/course', this.classCourseSelected.idCurso]);
		} else {
			console.log("Error: Debes seleccionar un curso antes de generar el silabo.");

			this.toastrService.error("Debes seleccionar un curso antes de Editar  curso", "Error");
		}

	}

	public necesidadCurso() {

		if (this.classCourseSelected && this.classCourseSelected.idCurso) {

			this.router.navigate(['/register/necesidad', this.classCourseSelected.idCurso]);
		} else {
			console.log("Error: Debes seleccionar un curso antes de generar el sílabo.");

			this.toastrService.error("Debes seleccionar un curso antes de generar la Necesidad de Curso.", "Error");
		}

	}


	public generacionSilaboCurso() {
		if (this.classCourseSelected && this.classCourseSelected.idCurso) {

			this.router.navigate(['/silabo', this.classCourseSelected.idCurso]);
		} else {
			console.log("Error: Debes seleccionar un curso antes de generar el sílabo.");

			this.toastrService.error("Debes seleccionar un curso antes de generar el sílabo.", "Error");
		}
	}


	public reistroFotograficoCurso() {

		if (this.classCourseSelected && this.classCourseSelected.idCurso) {

			this.router.navigate(['/registro/fotografico/curso/', this.classCourseSelected.idCurso,]);
		} else {

			this.toastrService.error("Debes seleccionar un curso antes de generar el Registro fotográfico", "Error");
		}

	}


}
