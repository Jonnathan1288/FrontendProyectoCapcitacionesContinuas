import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitador } from 'src/app/models/capacitador';
import { Persona } from 'src/app/models/persona';
import { Rol } from 'src/app/models/rol';
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
		private rolService: RolService,
		private usuarioService: UsuarioService,
		private capacitadorService: CapacitadorService,
		private toastrService: ToastrService,
		private scriptC: LoadScript,
		private imagenService: UploadService
	) {}

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

		await this.updatePerfilImage();
	}

	public getUriFile(fileName: string): string {
		return getFile(fileName, FOLDER_IMAGE_USER);
	}

	public async updatePerfilImage() {
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


