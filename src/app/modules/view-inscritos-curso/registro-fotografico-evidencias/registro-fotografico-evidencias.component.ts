import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { Persona } from 'src/app/models/persona';
import { RegistroFotograficoCurso } from 'src/app/models/registro-fotografico-curso';
import { CursoService } from 'src/app/service/curso.service';
import { PersonaService } from 'src/app/service/persona.service';
import { RegistroFotograficoCursoService } from 'src/app/service/registro-fotografico-curso.service';
import * as fileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-registro-fotografico-evidencias',
  templateUrl: './registro-fotografico-evidencias.component.html',
  styleUrls: ['./registro-fotografico-evidencias.component.css'],
})
export class RegistroFotograficoEvidenciasComponent implements OnInit {
  //entidad de registro fotografico
  public registroFotografico = new RegistroFotograficoCurso();

  public curso = new Curso();

  //idCurso para el cual nos servira para hacer el guardado de la informacion.
  public idCursoRouter?: number;

  public lisp: Persona[] = [];

  //
  cols: any[] = [];
  exportColumns: any[] = [];
  private sanitizer!: DomSanitizer;
  constructor(
    private registroFotograficoService: RegistroFotograficoCursoService,
    private actiRouter: ActivatedRoute,
    private cursoService: CursoService,
    sanitizer: DomSanitizer,
    private ps: PersonaService
  ) {
    this.sanitizer = sanitizer
  }
  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const id_curso = params['id'];
      // this.obtenerCursoPorId(id_curso);
    });
    this.ps.getListaPersonas().subscribe((data) => {
      this.lisp = data;
    });

    this.cols = [
      { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'quantity', header: 'Quantity' },
    ];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  exportPdf() {
    // import('jspdf').then((jsPDF) => {
    //   import('jspdf-autotable').then((x) => {
    //     const doc = new jsPDF.default(0, 0);
    //     doc.autoTable(this.exportColumns, this.products);
    //     doc.save('products.pdf');
    //   });
    // });
  }

  exportExcel() {
    // import("xlsx").then(xlsx => {
    //     const worksheet = xlsx.utils.json_to_sheet(this.products);
    //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     this.saveAsExcelFile(excelBuffer, "products");
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    fileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  //Método para traer el curso por la id que ingresa
  // public obtenerCursoPorId(idCurso: number){
  //   this.cursoService.getCursoById(idCurso).subscribe((data)=>{
  //     if(data != null){
  //       this.curso = data;
  //     }
  //   })
  // }

  // public saveEvidenciasRegistrofotografico(){

  //   this.registroFotografico.curso = this.curso;
  //   this.registroFotograficoService.saveRegistroFotograficoCurso(this.registroFotografico).subscribe((data)=>{
  //     if(data != null){
  //       alert('fuccesful')
  //     }
  //   })
  // }

  //Almacenar en el objeto
  // async subirFoto(event: any) {
  //   const file = event.target.files[0];
  //   const fileSize = file.size; // tamaño en bytes
  //   if (fileSize > 262144) {
  //     alert('La foto es muy pesada');
  //     event.target.value = null;
  //   } else {
  //     try {
  //       this.registroFotografico.foto = await this.convertToBase64(file);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // }

  //Conversion de la imagen en base 64
  // async convertToBase64(file: File): Promise<string> {
  //   const reader = new FileReader();
  //   return new Promise<string>((resolve, reject) => {
  //     reader.onload = () => {
  //       const result = btoa(reader.result as string);
  //       resolve(result);
  //     };
  //     reader.onerror = () => {
  //       reject(reader.error);
  //     };
  //     reader.readAsBinaryString(file);
  //   });
  // }
}
