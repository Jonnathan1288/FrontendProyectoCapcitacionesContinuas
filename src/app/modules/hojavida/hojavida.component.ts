import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HojaVidaCapacitadorService } from 'src/app/service/hoja-vida-capacitador.service';
import { HojaVidaCapacitador } from 'src/app/models/hoja-vida-capacitador';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { Capacitador } from 'src/app/models/capacitador';

@Component({
  selector: 'app-hojavida',
  templateUrl: './hojavida.component.html',
  styleUrls: ['./hojavida.component.css']
})
export class HojavidaComponent  implements OnInit{
  private sanitizer!: DomSanitizer;

  constructor(
    private toastrService: ToastrService,
    sanitizer: DomSanitizer,
    private hojaVidaService: HojaVidaCapacitadorService,
    private capcitadporService: CapacitadorService
  ){
    this.sanitizer = sanitizer;
  }

  idUsuarioLoggic!:any;
  ngOnInit(): void {
    this.idUsuarioLoggic = localStorage.getItem('id_username');
    console.log("id usuario + " + this.idUsuarioLoggic)
    this.validarExistenciaCV();
  }

  idNewHojaVida?: boolean;
  idUploadHojaVida?: boolean;

  public SubirHojaVida(){
    this.idNewHojaVida = false;
    this.idUploadHojaVida = true;
  }

  public generarHojaVida(){
    this.idNewHojaVida = true;
    this.idUploadHojaVida = false;
  }

  // VALIDAR EXISTENCIA DE HOJA DE VIDA
  idHojaVidaExsitente?: number;
  isExiste!: boolean;
  capacitador: Capacitador = new Capacitador();
  public validarExistenciaCV():void{
    this.hojaVidaService.validarExstenciaHojaVida(this.idUsuarioLoggic).subscribe(
      data =>{
        if (data == false) {
          alert('no tiene cv')
          this.isExiste = false;
          this.capcitadporService.getCapacitadorByUsuarioIdUsuario(this.idUsuarioLoggic).subscribe(
            data=>{
              this.capacitador = data;
            }
          )
        } else {
          alert('SI tiene cv')
          this.hojaVidaService.getHojadeVidaByIdUsuarioLoggin(this.idUsuarioLoggic).subscribe(
            data=>{
              this.isExiste = true;
              this.hojaVidaCapacitador = data;
              this.idHojaVidaExsitente = this.hojaVidaCapacitador!.idHojaVida;
              this.mostrarPDF_BDA();
              console.log("Datos -> " + this.idHojaVidaExsitente)
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
    console.log("esto se subio -> " + this.fileUrl)
  }

  // SUBIR EL PDF
  subirHojaVida():void{
    this.hojaVidaService.guardarHojadeVdaMasDocumento(this.selectedFile,this.idUsuarioLoggic).subscribe(
      data =>{
        alert('Se guardo')
      }
    )
  }

  // ACTUALIZAR LOS PDF
  actualizarHojaVidaDocumento():void{
    this.hojaVidaService.actualizarHojadeVdaMasDocumento(this.selectedFile,this.idUsuarioLoggic).subscribe(
      data =>{
        alert('Se actualizo el documentos')
      }
    )
  }

  // ACTULIAZAR HOJA DE VIDA DE NOSOTROS
  public actulizarHojaVida():void{
    this.hojaVidaService.updateHojaDeVida(this.idHojaVidaExsitente!,this.hojaVidaCapacitador).subscribe(
      data =>{
        alert("se actulizo")
      }
    )
  }

  public guardarHojaVida():void{
    this.hojaVidaCapacitador.capacitador = this.capacitador;
    this.hojaVidaCapacitador.estadoAprobacion = "P";
    this.hojaVidaService.saveHojaDeVida(this.hojaVidaCapacitador).subscribe(
      data =>{
        alert("se creo")
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
}
