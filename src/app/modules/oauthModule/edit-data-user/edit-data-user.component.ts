import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitador } from 'src/app/models/capacitador';
import { Persona } from 'src/app/models/persona';
import { Usuario } from 'src/app/models/usuario';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { PersonaService } from 'src/app/service/persona.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { FOLDER_IMAGE_USER, getFile } from 'src/app/util/folder-upload';
import { LocalStorageKeys, getAttributeStorage, getRole } from 'src/app/util/local-storage-manager';
import { UploadService } from 'src/app/service/upload.service';
import { PersonaFenixService } from 'src/app/service/fenix/persona-fenix.service';
import { SecurityService } from 'src/app/util/service/security.service';


@Component({
	selector: 'app-edit-data-user',
	templateUrl: './edit-data-user.component.html',
	styleUrls: ['./edit-data-user.component.css'],
})
export class EditDataUserComponent implements OnInit {

	public classPersona = new Persona();
	public persona = new Persona();
	public classUsuario = new Usuario();
	public classCapacitador = new Capacitador();
	public idUsuario?: any;
	public userRol?: any;
	public esDocenteCapacitador = false;
	public urlPhoto: any = '';
	public classCopyCapacitador = new Capacitador();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private personaService: PersonaService,
		private usuarioService: UsuarioService,
		private capacitadorService: CapacitadorService,
		private toastrService: ToastrService,
		private imagenService: UploadService,
		private personaFenixService: PersonaFenixService,
		private securityService: SecurityService
	) { }

	ngOnInit(): void {

		this.idUsuario = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
		this.userRol = getRole(LocalStorageKeys.ROL);
		this.obtenerDatosUsusario(this.idUsuario);
		if (localStorage.getItem('emp') === 'EMPTY') {
			this.toastrService.info('', 'COMPLETE SU PERFIL DE USUARIO');
		}
		this.urlPhoto = getAttributeStorage(LocalStorageKeys.URL_PHOTO);
	}

	public handleDivClick() {
		const pImageElement = document.querySelector('.p-image-preview-indicator') as any;

		if (pImageElement) {
			pImageElement.click();
		}
	}

	public obtenerDatosUsusario(idUsusario: number) {
		this.usuarioService.getUsuarioById(idUsusario).subscribe((data) => {
			if (data != null) {
				this.classUsuario = data;
				this.persona = this.classUsuario.persona!;
				if (this.persona.fechaNacimiento) {
					// PARSE THE DATE
					this.persona.fechaNacimiento = new Date(
						this.persona?.fechaNacimiento
					);
				}
				this.classPersona = { ...this.persona };
				this.validateKeysNotEmpty(this.classPersona)


				if (this.userRol === 'DocenteCapacitador') {
					this.capacitadorService
						.getCapacitadorByUsuarioIdUsuario(
							this.classUsuario.persona!.idPersona!
						)
						.subscribe((data) => {
							if (data != null) {
								this.classCopyCapacitador = data;
								this.classCapacitador = { ...this.classCopyCapacitador };
							}
						});
				}
			}
		});
	}

	public validateKeysNotEmpty(person: Persona) {
		if (
			!Object.entries(person)
				.filter(([key]) => Object.keys(person).includes(key))
				.every(([_, value]) => value)
		) {
			// const dominio = person.correo!.split('@')[1];
			// const resultado = dominio.includes('tecazuay.edu.ec');
			// resultado ? this.getPersonFenix(person.identificacion!) : null;

			this.getPersonFenix(person.identificacion!);
		}
	}

	//GET DATA PERSON FENIX
	public getPersonFenix(ci: string) {
		this.personaFenixService.personaPorCI(ci).subscribe({
			next: (resp) => {
				Object.assign(this.classPersona, { ...resp, idPersona: this.classPersona.idPersona });
				this.classPersona.fechaNacimiento = this.returnNewDate(resp.fechaNacimiento ? resp.fechaNacimiento : new Date());
				this.toastrService.success(
					'',
					' DATOS SINCRONIZADOS.',
					{
						timeOut: 1000,
					}
				);
			}, error: (err) => {
				this.toastrService.error(
					'',
					' INCONVENIENTES AL SINCRONIZAR DATOS.',
					{
						timeOut: 1000,
					}
				);
			}
		})
	}

	public returnNewDate(date: Date): Date {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + 1);
		return newDate;
	}

	selectedFile!: File;
	public avatarURLProfile: string = '';
	public async onFileSelected(event: any) {
		let data = event.target.files[0];

		if (data.size >= 1048576) {
			this.toastrService.warning(
				'El archivo seleccionado es demasiado grande',
				' Por favor, seleccione un archivo menor a 1000 KB.',
				{
					timeOut: 1000,
				}
			);
			event.target.value = null;
			return;
		}

		this.selectedFile = data;
		const imageURL = URL.createObjectURL(this.selectedFile);
		this.avatarURLProfile = imageURL;

		await this.updateProfileImage();
	}

	public getUriFile(fileName: string): string {
		return getFile(fileName, FOLDER_IMAGE_USER);
	}

	public async updateProfileImage() {
		let uri = await this.uploadImage();
		this.usuarioService.updatePictureUser(this.idUsuario, uri).subscribe({
			next: (resp) => {
				if (resp === 1) {
					this.toastrService.success('', 'FOTO ACTUALIZADA');
					localStorage.setItem('foto', String(this.securityService.encrypt(uri)));
				} else {
					this.toastrService.error('', 'INCONVENIENTE AL ACTUALIZAR FOTO');
				}
			},
			error: (err) => {
				this.toastrService.warning('Problemas al actualizar foto', '¡Comuníquese con soporte!');
			}
		});
	}


	public async uploadImage() {
		try {
			const result = await this.imagenService
				.upload(this.selectedFile, FOLDER_IMAGE_USER)
				.toPromise();
			return result.key;
		} catch (error) {
			throw new Error();
		}
	}

	public UpdateUser() {
		const indexFind = this.findIndex === '3' ? true : false;
		if (indexFind) {
			this.updateDocente();
		} else {
			if (Object.values(this.classPersona).every(value => value)) {
				this.personaService.updatePersona(this.classPersona.idPersona!, this.classPersona).subscribe(() => {
					this.toastrService.success('Excelente', 'Datos de Persona Actualizados');
				});
			} else {
				this.toastrService.warning('Advertencia', 'Datos personales incompletos');
			}
		}
	}

	public updateDocente() {
		if (Object.values(this.classCapacitador).every(value => value)) {
			this.capacitadorService.updateCapacitador(this.classCapacitador.idCapacitador!, this.classCapacitador).subscribe(() => {
				this.toastrService.success('Excelente', 'Datos Docente Actualizados');
			});
		} else {
			this.toastrService.warning('Advertencia', 'Datos docente incompletos');
		}
	}

	public findIndex: string = '1';
	public onTabChange(event: any) {
		if (event.index === 2) {
			this.findIndex = '3'
		} else { this.findIndex = '1' }
	}
}

