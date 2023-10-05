import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitador } from 'src/app/models/capacitador';
import { Persona } from 'src/app/models/persona';
import { Usuario } from 'src/app/models/usuario';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { LoadScript } from 'src/app/scripts/load-script';
import { FOLDER_IMAGE_USER, getFile } from 'src/app/util/folder-upload';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';
import { UploadService } from 'src/app/service/upload.service';
import { PersonaFenixService } from 'src/app/service/fenix/persona-fenix.service';
import { INCLUDE_FIELDS } from 'src/app/util/exlude-data-person';

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
	public usuLoginRol?: any;
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
	) { }

	ngOnInit(): void {

		this.idUsuario = localStorage.getItem('id_username');
		this.usuLoginRol = localStorage.getItem('rol');
		this.obtenerDatosUsusario(this.idUsuario);
		if (localStorage.getItem('emp') === 'EMPTY') {
			this.toastrService.info('', 'COMPLETE SU PERFIL DE USUARIO');
		}
		this.urlPhoto = getAttributeStorage(LocalStorageKeys.URL_PHOTO);
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


				if (this.usuLoginRol === 'DocenteCapacitador') {
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
			const dominio = person.correo!.split('@')[1];
			const resultado = dominio.includes('tecazuay.edu.ec');
			resultado ? this.getPersonFenix(person.identificacion!) : null;
		}
	}

	//GET DATA PERSON FENIX
	public getPersonFenix(ci: string) {
		this.personaFenixService.personaPorCI(ci).subscribe({
			next: (resp) => {
				this.classPersona = resp;

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
					localStorage.setItem('foto', String(uri));
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

}


