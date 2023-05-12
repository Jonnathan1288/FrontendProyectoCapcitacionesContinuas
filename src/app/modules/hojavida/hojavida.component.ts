import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { HojaVidaCapacitador } from 'src/app/models/hoja-vida-capacitador';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { Capacitador } from 'src/app/models/capacitador';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hojavida',
  templateUrl: './hojavida.component.html',
  styleUrls: ['./hojavida.component.css']
})
export class HojavidaComponent implements OnInit {
  private sanitizer!: DomSanitizer;

  constructor(
    private toastrService: ToastrService,
    sanitizer: DomSanitizer,
    private hojaVidaService: HojaVidaCapacitadorService,
    private capcitadporService: CapacitadorService,
    private activeRouter: ActivatedRoute,
    private router: Router,
  ) {
    this.sanitizer = sanitizer;
  }

  idUsuarioLoggic!: any;
  ngOnInit(): void {
    this.idUsuarioLoggic = localStorage.getItem('id_username');
    console.log("id usuario + " + this.idUsuarioLoggic)
    this.validarExistenciaCV();
  }

  idNewHojaVida?: boolean;
  idUploadHojaVida?: boolean;

  public SubirHojaVida() {
    this.idNewHojaVida = false;
    this.idUploadHojaVida = true;
  }

  public generarHojaVida() {
    this.idNewHojaVida = true;
    this.idUploadHojaVida = false;
  }

  // VALIDAR EXISTENCIA DE HOJA DE VIDA
  idHojaVidaExsitente?: number;
  isExiste!: boolean;
  capacitador: Capacitador = new Capacitador();
  idCapacitadorCap!: number;
  public validarExistenciaCV(): void {
    this.hojaVidaService.validarExstenciaHojaVida(this.idUsuarioLoggic).subscribe(
      data => {
        if (data == false) {
          // alert('no tiene cv')
          this.isExiste = false;
          this.capcitadporService.getCapacitadorByUsuarioIdUsuario(this.idUsuarioLoggic).subscribe(
            data => {
              this.capacitador = data;
              this.idCapacitadorCap = this.capacitador.idCapacitador!;
              console.log("id -> " + this.idCapacitadorCap)
            }
          )
        } else {
          // alert('SI tiene cv')
          this.hojaVidaService.getHojadeVidaByIdUsuarioLoggin(this.idUsuarioLoggic).subscribe(
            data => {
              this.isExiste = true;
              this.hojaVidaCapacitador = data;
              const idiomas = this.hojaVidaCapacitador.idiomas!.split(', ');
              this.listIdiomas.push(...idiomas);
              const destrezas = this.hojaVidaCapacitador.destrezas!.split(', ');
              this.listDestrezas.push(...destrezas);
              const educacion = this.hojaVidaCapacitador.experienciaEscolar!.split('| ');
              this.listEducacion.push(...educacion);
              const laboral = this.hojaVidaCapacitador.experiencialLaboral!.split('| ');
              this.listLaboral.push(...laboral);
              this.idHojaVidaExsitente = this.hojaVidaCapacitador!.idHojaVida;
              this.mostrarPDF_BDA();
              console.log("Datos -> " + this.idHojaVidaExsitente)
              this.capcitadporService.getCapacitadorByUsuarioIdUsuario(this.idUsuarioLoggic).subscribe(
                data => {
                  this.capacitador = data;
                  this.idCapacitadorCap = this.capacitador.idCapacitador!;
                  console.log("id -> " + this.idCapacitadorCap)
                }
              )
            }
          )
        }
      }
    )
  }

  // TRAER AL CAPACITADOR
  hojaVidaCapacitador: HojaVidaCapacitador = new HojaVidaCapacitador();

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
    //console.log("esto se subio -> " + this.fileUrl)
  }

  // SUBIR EL PDF
  subirHojaVida(): void {
    this.hojaVidaService.guardarHojadeVdaMasDocumento(this.selectedFile, this.idUsuarioLoggic).subscribe(
      data => {
        this.toastrService.success('Se guardo correctamente', 'Registro Exitoso');
        this.validarExistenciaCV();
      }
    )
  }

  // ACTUALIZAR LOS PDF
  actualizarHojaVidaDocumento(): void {

    if (this.isTieneArchivo === false) {
      this.toastrService.error('No ha seleccionado uno nuevo', 'Error');

    } else {
      this.hojaVidaService.actualizarHojadeVdaMasDocumento(this.selectedFile, this.idUsuarioLoggic).subscribe(
        data => {
          this.toastrService.success('Se actualizo correctamente', 'Registro Actualizado');
        }
      )
    }
   
  }

  // ACTULIAZAR HOJA DE VIDA DE NOSOTROS
  public actulizarHojaVida(): void {
    this.hojaVidaService.updateHojaDeVida(this.idHojaVidaExsitente!, this.hojaVidaCapacitador).subscribe(
      data => {
        this.toastrService.success('Se actualizo correctamente', 'Registro Actualizado');
      }
    )
  }

  public guardarHojaVida(): void {
    this.hojaVidaCapacitador.capacitador = this.capacitador;
    this.hojaVidaCapacitador.estadoAprobacion = "P";
    this.hojaVidaCapacitador.idiomas = this.listIdiomas.join(', ');
    this.hojaVidaService.saveHojaDeVida(this.hojaVidaCapacitador).subscribe(
      data => {
        this.toastrService.success('Se guardo correctamente', 'Registro Exitoso');
      }
    )
  }

  // TRAER EL PDF
  //mETOO QUE ME MOSTRAR EN EL CASO DE LA VISTA
  public mostrarPDF_BDA(): void {
    const byteCharacters = atob(this.hojaVidaCapacitador.documento);
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

  // PASAR IDS
  public verrHojaVida(): void {
    this.router.navigate(['/ver/hojaVida/capacitador/', this.idCapacitadorCap]);
  }

  // AGREGAR IDIOMAS
  listIdiomas: String[] = [];
  idiomaCap!: String;

  agregarIdioma(): void {
    if (this.idiomaCap) {
      this.listIdiomas.push(this.idiomaCap);
      this.hojaVidaCapacitador.idiomas = this.listIdiomas.join(', ');
      this.idiomaCap = '';
    }
  }

  quitarElementoLLeno(idioma:any): void {
    const index = this.listIdiomas.findIndex(item => item === idioma);
    if (index !== -1) {
      this.listIdiomas.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
      this.hojaVidaCapacitador.idiomas = this.listIdiomas.join(', ');
    }
  }

  // AGREGAR DESTREZAS
  listDestrezas: String[] = [];
  destrezasCap!: String;

  agregarDestreza(): void {
    if (this.destrezasCap) {
      this.listDestrezas.push(this.destrezasCap);
      this.hojaVidaCapacitador.destrezas = this.listDestrezas.join(', ');
      this.destrezasCap = '';
    }
  }

  quitarElementoLLenoD(destreza:any): void {
    const index = this.listDestrezas.findIndex(item => item === destreza);
    if (index !== -1) {
      this.listDestrezas.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
      this.hojaVidaCapacitador.destrezas = this.listDestrezas.join(', ');
    }
  }

  // AGREGAR EDUCACION
  listEducacion: String[] = [];
  educacionCap!: String;

  agregarEducacion(): void {
    if (this.educacionCap) {
      this.listEducacion.push(this.educacionCap);
      this.hojaVidaCapacitador.experienciaEscolar = this.listEducacion.join('| ');
      this.educacionCap = '';
    }
  }

  quitarElementoLLenoE(destreza:any): void {
    const index = this.listEducacion.findIndex(item => item === destreza);
    if (index !== -1) {
      this.listEducacion.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
      this.hojaVidaCapacitador.experienciaEscolar = this.listEducacion.join('| ');
    }
  }

  // AGREGAR LABURO
  listLaboral: String[] = [];
  laboralCap!: String;

  agregarLaboral(): void {
    if (this.laboralCap) {
      this.listLaboral.push(this.laboralCap);
      this.hojaVidaCapacitador.experiencialLaboral = this.listLaboral.join('| ');
      this.laboralCap = '';
    }
  }

  quitarElementoLLenoL(laboral:any): void {
    const index = this.listLaboral.findIndex(item => item === laboral);
    if (index !== -1) {
      this.listLaboral.splice(index, 1);
      this.toastrService.error('Datos eliminados', 'Eliminado');
      this.hojaVidaCapacitador.experiencialLaboral = this.listLaboral.join('| ');
    }
  }
}
