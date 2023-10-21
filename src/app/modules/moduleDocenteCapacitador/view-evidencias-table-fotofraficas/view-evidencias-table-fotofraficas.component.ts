import { Component, OnInit } from '@angular/core';
import { RegistroFotograficoCurso } from 'src/app/models/registro-fotografico-curso';
import { RegistroFotograficoCursoService } from 'src/app/service/registro-fotografico-curso.service';
import {
	trigger,
	state,
	style,
	transition,
	animate,
} from '@angular/animations';
import { Curso } from 'src/app/models/curso';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/service/curso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { ToastrService } from 'ngx-toastr';

import { UploadService } from 'src/app/service/upload.service';
import { FOLDER_IMAGE_RFOTOGRAFICO, getFile } from 'src/app/util/folder-upload';
@Component({
	selector: 'app-view-evidencias-table-fotofraficas',
	templateUrl: './view-evidencias-table-fotofraficas.component.html',
	styleUrls: ['./view-evidencias-table-fotofraficas.component.css'],
	styles: [
		`
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
	],
	animations: [
		trigger('rowExpansionTrigger', [
			state(
				'void',
				style({
					transform: 'translateX(-10%)',
					opacity: 0,
				})
			),
			state(
				'active',
				style({
					transform: 'translateX(0)',
					opacity: 1,
				})
			),
			transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
		]),
	],
})
export class ViewEvidenciasTableFotofraficasComponent implements OnInit {
	public listRegistroFotografico: RegistroFotograficoCurso[] = [];

	public registroFotografico = new RegistroFotograficoCurso();

	public curso = new Curso();
	public selectedFile!: File;
	public previewImageUrl: string | null = null; // Propiedad para mostrar la previsualización
	//idCurso para el cual nos servira para hacer el guardado de la informacion.
	public idCursoRouter?: number;

	constructor(
		private registroFotograficoService: RegistroFotograficoCursoService,
		private actiRouter: ActivatedRoute,
		private cursoService: CursoService,
		private reportService: ReportsCapacitacionesService,
		private regfService: RegistroFotograficoCursoService,
		private toastrService: ToastrService,
		private uploadService: UploadService
	) { }

	ngOnInit(): void {
		this.actiRouter.params.subscribe((params) => {
			const id_curso = params['id'];
			this.idCursoRouter = id_curso;
			this.obtenerCursoPorId(id_curso);
			this.obtenerTodosRegistrofotograficosPorCurso(id_curso);
		});
	}

	public obtenerTodosRegistrofotograficosPorCurso(idRegistroFoto: number) {
		this.regfService
			.getRegistroFotograficoCursoAllByIdCurso(idRegistroFoto)
			.subscribe((data) => {
				this.listRegistroFotografico = data;

			});
	}

	public obtenerURLImagen(regFotografico: any): string {
		return getFile(regFotografico, FOLDER_IMAGE_RFOTOGRAFICO);
	}

	//Método para traer el curso por la id que ingresa
	public obtenerCursoPorId(idCurso: number) {
		this.cursoService.getCursoById(idCurso).subscribe((data) => {
			if (data != null) {
				this.curso = data;
				if (this.curso.estadoAprovacionCurso !== 'A') {
					this.toastrService.info("Este curso aún no ha sido aprobado por el administrador. Por favor, espere la aprobación para acceder a las funciones del curso.");
				}
			}
		});
	}

	public async saveEvidenciasRegistrofotografico() {

		if (this.registroFotografico.idRegistroFotograficoCurso) {

			if (this.selectedFile) {
				try {
					const key = await this.uploadImagen();
					this.registroFotografico.foto = key;
				} catch (error) {
					console.error('Peoblem')
				}

			}

			this.registroFotograficoService
				.updateRegistroFotografico(
					this.registroFotografico.idRegistroFotograficoCurso!,
					this.registroFotografico
				)
				.subscribe((data) => {
					if (data != null) {
						this.toastrService.success(
							'El registro fotográfico ha sido actualizado.',
							'REGISTRO ACTUALIZADO'
						);
						// alert('succesful update');
						this.obtenerTodosRegistrofotograficosPorCurso(this.idCursoRouter!);
						this.registroFotografico = new RegistroFotograficoCurso();
						this.visible = false;
					}
				});
		} else {
			try {
				const key = await this.uploadImagen();
				this.registroFotografico.foto = key;
			} catch (error) {
				console.error('Peoblem')
			}
			this.registroFotografico.curso = this.curso;
			this.registroFotograficoService
				.saveRegistroFotograficoCurso(this.registroFotografico)
				.subscribe((data) => {
					if (data != null) {
						// alert('fuccesful');
						this.toastrService.success(
							'El registro fotográfico ha sido guardado',
							'GUARDADO CON ÉXITO'
						);
						this.visible = false;
						this.registroFotografico = new RegistroFotograficoCurso();
						this.obtenerTodosRegistrofotograficosPorCurso(this.idCursoRouter!);
					}
				});
		}
	}

	//GUARDAR IMAGEN EN EL BACK
	public async uploadImagen() {
		try {
			const result = await this.uploadService
				.upload(this.selectedFile, FOLDER_IMAGE_RFOTOGRAFICO)
				.toPromise();
			return result.key;
		} catch (error) {
			console.error('new income');
		}
	}

	public onFileSelected(event: any) {
		let data = event.target.files[0];

		if (data.size >= 1000000) {
			this.toastrService.error('', 'LA FOTO ES MUY GRANDE.', { timeOut: 2000 });
			return;
		}

		this.selectedFile = data;
		const imageURL = URL.createObjectURL(this.selectedFile);
		this.previewImageUrl = imageURL;
		console.log('Selected file:', this.selectedFile, this.previewImageUrl);
	}

	public validacionRegistroFotografico() {

		if (
			!this.registroFotografico.fecha ||
			!this.registroFotografico.descripcionFoto ||
			!this.selectedFile
		) {
			this.toastrService.error(
				'Todos los campos deben estar llenos.',
				'CAMPOS VACÍOS'
			);
		} else {
			const fechaInicio = new Date(this.curso.fechaInicioCurso!);
			const fechaFin = new Date(this.curso.fechaFinalizacionCurso!);
			const fecha = new Date(this.registroFotografico.fecha);

			// Convertir las fechas en cadenas en formato ISO 8601
			const fechaInicioString = fechaInicio.toISOString().split('T')[0];
			const fechaFinString = fechaFin.toISOString().split('T')[0];
			const fechaString = fecha.toISOString().split('T')[0];

			if (fechaString < fechaInicioString) {
				this.toastrService.warning(
					'No puede ingresar una fecha previa a la fecha de inicio del curso.',
					'FECHA PREVIA'
				);
				// min
			} else if (fechaString > fechaFinString) {
				this.toastrService.warning(
					'No puede ingresar una fecha posterior a la fecha de finalización del curso.',
					'FECHA POSTERIOR'
				);
				//may
			} else {
				this.saveEvidenciasRegistrofotografico();
				// console.log('La fecha está dentro del rango válido');
			}
		}
	}

	// limpiarCampos(); 

	//VISIVILIADA DEL MODAL
	public visible?: boolean;

	public showModaL() {
		this.limpiarCampos();
		this.registroFotografico = new RegistroFotograficoCurso();
		this.visible = true;
	}
	//FIN DE LA VISIVILIDAD DE DEL MODAL
	public eliminadoLogicoDelregistroFotografico(
		registroFotografico: RegistroFotograficoCurso
	) {
		// registroFotografico.estado = false;
		registroFotografico.estado = !registroFotografico.estado; // Alternar el estado activo/desactivado
		this.registroFotograficoService
			.updateRegistroFotografico(
				registroFotografico.idRegistroFotograficoCurso!,
				registroFotografico
			)
			.subscribe((data) => {
				if (data != null) {
					if (registroFotografico.estado) {
						this.toastrService.success(
							'El registro fotográfico está visible',
							'Activación Exitosa'
						);
					} else {
						this.toastrService.warning(
							'El registro fotográfico ya no está en el reporte',
							'Desactivación Exitosa'
						);
					}

					this.obtenerTodosRegistrofotograficosPorCurso(this.idCursoRouter!);
				}
			});
	}

	public cargarDatosRegistrofotografico(registroFofotrafico: RegistroFotograficoCurso) {
		this.registroFotografico = { ...registroFofotrafico };
		this.curso = this.registroFotografico.curso!;
		this.previewImageUrl = this.obtenerURLImagen(registroFofotrafico.foto);

		if (this.registroFotografico.fecha) {
			this.registroFotografico.fecha = new Date(this.registroFotografico.fecha);
		}
		this.visible = true;
	}


	//IMPLEMENTAR LA OPCIÓN PARA LA DESCARGA DEL PDF GENERADO DEL CURSO
	public getReportRegistroFotograficoCurso() {
		const todosInactivos = this.listRegistroFotografico.every(
			(registro) => !registro.estado
		);

		if (todosInactivos) {
			this.toastrService.info('No hay registros activos o no existen.', 'Sin Registros');
		} else {
			this.reportService
				.gedownloadRegistroFotograficoCurso(this.idCursoRouter!)
				.subscribe((r) => {
					const url = URL.createObjectURL(r);
					window.open(url, '_blank');
				});
		}
	}


	public limpiarCampos() {
		this.registroFotografico = new RegistroFotograficoCurso();
		this.selectedFile = {} as File;
		this.previewImageUrl = null;
		this.previewImageUrl = '';
	}

}



