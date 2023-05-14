import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PeriodoPrograma } from 'src/app/models/periodo-programa';
import { Programas } from 'src/app/models/programa';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ToastrService } from 'ngx-toastr';
import { DocumentoSenecytService } from 'src/app/service/documento-senecyt.service';
import { DocumentoSenecyt } from 'src/app/models/documento-senecyt';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-documento-senecyt',
  templateUrl: './documento-senecyt.component.html',
  styleUrls: ['./documento-senecyt.component.css'],
})
export class DocumentoSenecytComponent implements OnInit {


  private sanitizer!: DomSanitizer;

  public listDocumentoExel: DocumentoSenecyt[]=[];
  public classDocumentoExel = new DocumentoSenecyt();
  public idUsuarioLocal?: any;
public classUsuario = new Usuario();
  constructor(
    private periodoProgramaService: PeriodoProgramaService,
    private programaService: ProgramasService,
    sanitizer: DomSanitizer,
    private toastrService: ToastrService,
    private documentoSenecytService: DocumentoSenecytService,
    private usuarioServcie: UsuarioService
  ) {
    this.sanitizer = sanitizer;
  }
  ngOnInit(): void {
    this.idUsuarioLocal = localStorage.getItem('id_username');
    this.obtenerTodosLosDocumentosExel();
    this.obtenerUsuario(this.idUsuarioLocal);
  }

  public obtenerUsuario(idUsuario: number){
    this.usuarioServcie.getUsuarioById(idUsuario).subscribe((data)=>{
      if(data != null){
        this.classUsuario = data;
      }
    })
  }

  public obtenerTodosLosDocumentosExel() {
    this.documentoSenecytService.listDocumentoSenecyt().subscribe((data) => {
      if (data != null) {
        this.listDocumentoExel = data;
        this.listDocumentosCopy = this.listDocumentoExel
      }
    });
  }

  public validacionDocumentosExel(){
    if(!this.classDocumentoExel.descripcion || !this.classDocumentoExel.documentoExel){
      this.toastrService.error(
        'Campo vacío o no esta seleccionado el documento Excel..',
        'CAMPOS VACIOS'
      );
    }else{
      this.createUpdateDocumentoExel();
    }
  }

  public createUpdateDocumentoExel(){
    if(this.classDocumentoExel.idDocumentoSenecyt){
      this.documentoSenecytService.updateDocumentoSenecyt(this.classDocumentoExel.idDocumentoSenecyt, this.classDocumentoExel).subscribe((data)=>{
        if(data != null){
          this.toastrService.success(
            'El documento a sido actualizado correctamente.',
            'DOCUMENTO ACTUALIZADO'
          );
          this.classDocumentoExel = new DocumentoSenecyt();
          this.visible = false;
          location.reload();

        }
      })
      //update
    }else{

      this.classDocumentoExel.usuario = this.classUsuario;
      this.classDocumentoExel.estadoDocumento = true;
      this.documentoSenecytService.saveDocumentoSenecyt(this.classDocumentoExel).subscribe((data)=>{
        if(data != null){
          this.toastrService.success(
            'El documento a sido creado correctamente.',
            'DOCUMENTO CREADO'
          );
          this.classDocumentoExel = new DocumentoSenecyt();
          this.visible= false;
        location.reload();
        }
      })
    }
  }

  handleExcelInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
      this.classDocumentoExel.documentoExel = e.target.result;

      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.classDocumentoExel.documentoExel!);
    };
  
    reader.readAsDataURL(file);
  }





  //Lo que vamos hacer es el eliminado logico
  public updateStatusCodigosExel(doc: DocumentoSenecyt) {
    // programa.estadoProgramaActivo = true;
    doc.estadoDocumento = !doc.estadoDocumento; // Alternar el estado activo/desactivado

    this.documentoSenecytService
      .updateDocumentoSenecyt(doc.idDocumentoSenecyt!, doc!)
      .subscribe((data) => {
        if (data != null) {
      
          if (doc.estadoDocumento) {
            this.toastrService.success(
              'Documento en proceso de mandar imprimir códigos.',
              'Activación Exitosa'
            );
          } else {
            this.toastrService.warning(
              'Documento verificado',
              'Desactivación Exitosa'
            );
          }
        }
      });
  }

  //Vamos a actualizar

  public cargarDatos(documentoSenecyt: DocumentoSenecyt) {
    this.classDocumentoExel = { ...documentoSenecyt };

    this.visible = true;
  }

  //vISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    this.visible = true;
  }

  //Implementacion del evento de la fecha
  public pdfSrc: any;

  //FILTRO PARA LA BUSQUEDAD

  public wordNoFind?: any;
  public listDocumentosCopy: DocumentoSenecyt[] = [];
  public filterTableProgramasCapacitacion(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      this.listDocumentosCopy = this.listDocumentoExel;
    } else {
      let listDoc = this.listDocumentosCopy.filter(
        (p) =>
          p.descripcion?.toLowerCase().includes(this.wordNoFind)
      );

      this.listDocumentosCopy = listDoc;
    }
  }
}
