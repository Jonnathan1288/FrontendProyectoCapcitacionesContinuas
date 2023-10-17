import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { HojaVidaCapacitador } from 'src/app/models/hoja-vida-capacitador';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { Capacitador } from 'src/app/models/capacitador';
import { FOLDER_DOCUMENTS_HOJA_VIDA, getFile } from 'src/app/util/folder-upload';
import { UploadService } from 'src/app/service/upload.service';
import { HojaVida } from 'src/app/models/references/hoja-vida';
import { LocalStorageKeys, getAttributeStorage } from 'src/app/util/local-storage-manager';

@Component({
	selector: 'app-hojavida',
	templateUrl: './hojavida.component.html',
	styleUrls: ['./hojavida.component.css']
})
export class HojavidaComponent implements OnInit {

	public uriDocument: any;
	public hojaVidaCap = new HojaVidaCapacitador();

	constructor(
		private toastrService: ToastrService,
		private sanitizer: DomSanitizer,
		private hojaVidaService: HojaVidaCapacitadorService,
		private capcitadporService: CapacitadorService,

		private uploadService: UploadService
	) {
	}

	idUsuarioLoggic!: any;
	ngOnInit(): void {
		this.idUsuarioLoggic = getAttributeStorage(LocalStorageKeys.ID_USUARIO);
		this.obtenerDocentePorIdUsuario(this.idUsuarioLoggic);
		this.obtenerHojaDeVidata(this.idUsuarioLoggic)
	}

	public hojaVida = new HojaVida();
	public obtenerHojaDeVidata(id: number) {
		this.hojaVidaService.findDocumentByIdUsuario(id).subscribe({
			next: (resp) => {
				console.log(resp)
				this.hojaVida = resp;

			}, error: (err) => {
			}
		})
	}

	public obtenerDocentePorIdUsuario(id: number) {
		this.capcitadporService.getCapacitadorByUsuarioIdUsuario(id).subscribe({
			next: (resp) => {
				this.capacitador = resp;

			}, error: (err) => {

			},
		})
	}

	idNewHojaVida?: boolean;
	idUploadHojaVida?: boolean;

	public SubirHojaVida() {
		this.idNewHojaVida = false;
		this.idUploadHojaVida = true;
	}

	// VALIDAR EXISTENCIA DE HOJA DE VIDA
	idHojaVidaExsitente?: number;
	isExiste!: boolean;
	public capacitador: Capacitador = new Capacitador();
	idCapacitadorCap!: number;


	// SUBIR HOJA DE VIDA
	selectedFile!: File;
	fileUrl!: SafeResourceUrl;
	isTieneArchivo: boolean = false;
	onFileSelected(event: any) {
		this.selectedFile = event.target.files[0];
		if (this.selectedFile && this.selectedFile.size > 300000) {
			this.toastrService.warning(
				'El archivo seleccionado es demasiado grande',
				' Por favor, seleccione un archivo menor a 300 KB.',
				{
					timeOut: 1000,
				}
			);
			return;
		}
		this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
			URL.createObjectURL(this.selectedFile)
		);
		this.isTieneArchivo = true;
	}

	// SUBIR EL PDF
	public async subirHojaVida() {
		if (!this.capacitador) {
			this.toastrService.error('INTÉNTELO MÁS TARDE');
			return
		}
		try {
			this.hojaVidaCap.capacitador = this.capacitador;
			this.hojaVidaCap.documento = await this.uploadDocument();
			this.hojaVidaCap.status = true;
			this.hojaVidaService.save(this.hojaVidaCap).subscribe({
				next: (resp) => {
					this.toastrService.success('SUBIDO');
					location.reload();

				}, error: (err) => {
					this.toastrService.success('ERROR AL SUBIR');
				}
			})
		} catch (error) {
			this.toastrService.error('Error, documento .pdf no se guardó intentar nuevamente...');
		}
	}


	public async updateCV() {
		try {
			this.hojaVidaCap.idHojaVida = this.hojaVida.idHojaVida

			this.hojaVidaCap.documento = await this.uploadDocument();
			this.hojaVidaCap.capacitador = this.capacitador;
			this.hojaVidaCap.status = true;
			this.hojaVidaService.update(this.hojaVidaCap.idHojaVida!, this.hojaVidaCap).subscribe(
				data => {
					this.toastrService.success('Se actualizo correctamente', 'Registro Actualizado');
					location.reload();
				}
			)
		} catch (error) {
			this.toastrService.error('Error, documento .pdf no se guardó intentar nuevamente...');
		}

	}

	public mostrarPDF_BDA(documento: any): void {
		const byteCharacters = atob(documento);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
		this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
			window.URL.createObjectURL(pdfBlob)
		);
	}

	public async uploadDocument() {
		try {
			const result = await this.uploadService.upload(this.selectedFile, FOLDER_DOCUMENTS_HOJA_VIDA)
				.toPromise();
			return result.key;
		} catch (error) {
			console.error('error al subir el documento')
		}
	}

	public getFileResource(): string {
		return getFile(this.hojaVida.uriDocument!, FOLDER_DOCUMENTS_HOJA_VIDA);
	}

}
