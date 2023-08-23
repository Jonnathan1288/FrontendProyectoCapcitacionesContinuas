import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Persona } from 'src/app/models/persona';
import { RegistroFotograficoCurso } from 'src/app/models/registro-fotografico-curso';
import { CursoService } from 'src/app/service/curso.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RegistroFotograficoCursoService } from 'src/app/service/registro-fotografico-curso.service';
import * as fileSaver from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AreaService } from 'src/app/service/area.service';


@Component({
  selector: 'app-registro-fotografico-evidencias',
  templateUrl: './registro-fotografico-evidencias.component.html',
  styleUrls: ['./registro-fotografico-evidencias.component.css'],
})
export class RegistroFotograficoEvidenciasComponent implements OnInit {

  exportColumns: any[] = [];
  private sanitizer!: DomSanitizer;
  constructor(
    sanitizer: DomSanitizer,
    private areaSer: AreaService
  ) {
    this.sanitizer = sanitizer
  }
  ngOnInit(): void {

  }

  imprimirTabla() {
    window.print();
  }




  // handleFileInput(event: any) {
  //   const file: File = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     const base64Pdf = reader.result as string;
  //     this.pdfp.pdf = base64Pdf.split(',')[1];
  //   };

  //   reader.readAsDataURL(file);
  // }






  //PARA EL EXEL

  // pruebaPdf: PruebaPdf = {};
  // pdfSrc: SafeResourceUrl | undefined; // Propiedad para almacenar el enlace al archivo Excel

  // handleExcelInput(event: any) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = (e: any) => {
  //     this.pdfp.exel = btoa(e.target.result)!;

  //     // Genera el enlace seguro para el archivo Excel
  //     this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
  //       'data:application/vnd.ms-excel;base64,' + this.pdfp.exel
  //     );
  //   };

  //   reader.readAsBinaryString(file);
  // }



}
