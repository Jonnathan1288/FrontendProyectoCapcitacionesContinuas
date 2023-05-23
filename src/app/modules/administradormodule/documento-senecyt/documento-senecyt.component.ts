import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ToastrService } from 'ngx-toastr';
import { DocumentoSenecytService } from 'src/app/service/documento-senecyt.service';
import { DocumentoSenecyt } from 'src/app/models/documento-senecyt';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Table } from 'primeng/table';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { AreaService } from 'src/app/service/area.service';

@Component({
  selector: 'app-documento-senecyt',
  templateUrl: './documento-senecyt.component.html',
  styleUrls: ['./documento-senecyt.component.css'],
  providers: [ConfirmationService],
})
export class DocumentoSenecytComponent implements OnInit {
  private sanitizer!: DomSanitizer;

  public listDocumentoExel: DocumentoSenecyt[] = [];
  public classDocumentoExel = new DocumentoSenecyt();
  public idUsuarioLocal?: any;
  public classUsuario = new Usuario();
  constructor(
    private areaService: AreaService,
    sanitizer: DomSanitizer,
    private toastrService: ToastrService,
    private documentoSenecytService: DocumentoSenecytService,
    private usuarioServcie: UsuarioService,
    private confirmationService: ConfirmationService
  ) {
    this.sanitizer = sanitizer;
  }
  ngOnInit(): void {
    this.idUsuarioLocal = localStorage.getItem('id_username');
    this.obtenerTodosLosDocumentosExel();
    this.obtenerUsuario(this.idUsuarioLocal);
    this.getUsersOfEmailSend();
  }

  public obtenerUsuario(idUsuario: number) {
    this.usuarioServcie.getUsuarioById(idUsuario).subscribe((data) => {
      if (data != null) {
        this.classUsuario = data;
      }
    });
  }

  public obtenerTodosLosDocumentosExel() {
    this.documentoSenecytService.listDocumentoSenecyt().subscribe((data) => {
      if (data != null) {
        this.listDocumentoExel = data;
        this.listDocumentosCopy = this.listDocumentoExel;
      }
    });
  }

  public validacionDocumentosExel() {
    if (
      !this.classDocumentoExel.descripcion ||
      !this.classDocumentoExel.documentoExel
    ) {
      this.toastrService.error(
        'Campo vacío o no esta seleccionado el documento Excel..',
        'CAMPOS VACIOS'
      );
    } else {
      this.createUpdateDocumentoExel();
    }
  }

  public createUpdateDocumentoExel() {
    if (this.classDocumentoExel.idDocumentoSenecyt) {
      this.documentoSenecytService
        .updateDocumentoSenecyt(
          this.classDocumentoExel.idDocumentoSenecyt,
          this.classDocumentoExel
        )
        .subscribe((data) => {
          if (data != null) {
            this.toastrService.success(
              'El documento a sido actualizado correctamente.',
              'DOCUMENTO ACTUALIZADO'
            );
            this.classDocumentoExel = new DocumentoSenecyt();
            this.visible = false;

            setTimeout(() => {
              location.reload();
            }, 1200);

          }
        });
      //update
    } else {
      this.classDocumentoExel.usuario = this.classUsuario;
      this.classDocumentoExel.estadoDocumento = false;
      this.documentoSenecytService
        .saveDocumentoSenecyt(this.classDocumentoExel)
        .subscribe((data) => {
          if (data != null) {
            this.toastrService.success(
              'El documento a sido creado correctamente.',
              'DOCUMENTO CREADO'
            );
            this.classDocumentoExel = new DocumentoSenecyt();
            this.visible = false;
            location.reload();
          }
        });
    }
  }

  handleExcelInput(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.classDocumentoExel.documentoExel = e.target.result;

      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.classDocumentoExel.documentoExel!
      );
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
      let listDoc = this.listDocumentoExel.filter((p) =>
        p.descripcion?.toLowerCase().includes(this.wordNoFind)
      );

      this.listDocumentosCopy = listDoc;
    }
  }

  public listUsers: Usuario[] = [];
  public getUsersOfEmailSend() {
    this.usuarioServcie.listUsuario().subscribe((data) => {
      if (data != null) {
        this.listUsers = data.filter((d) => d.username !== 'admin');
      }
    });
  }

  public displayMaximizable?: boolean;
  public idDocumentoSenescyt?: number;
  showMaximizableDialog(idDocumentoSenescyt: number) {
    this.idDocumentoSenescyt = idDocumentoSenescyt;
    this.displayMaximizable = true;
  }

  clear(table: Table) {
    table.clear();
  }
  //METODO DE CONFIRMACION PARA ENVIAR EL EMAIL AL SERVIDOR..
  public updateVerificationEstadoEnvio(doc: DocumentoSenecyt) {
    this.confirmationService.confirm({
      message: 'Esta seguro de volverlo a poner como no enviado?',
      header: 'Le informamos que este correo ya fue enviado.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
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
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastrService.info('', 'DESAVTIVACIÓN CANCELADA.', {
              timeOut: 1200,
            });

            break;
          case ConfirmEventType.CANCEL:
            this.toastrService.success('', 'SIN NINGUNA ACCIÓN.', {
              timeOut: 1200,
            });
            break;
        }
      },
    });
  }

  //METODO DE CONFIRMACION PARA ENVIAR EL EMAIL AL SERVIDOR..
  public sendEmailCodigosSenecyt(user: Usuario) {
    this.confirmationService.confirm({
      message:
        'Esta seguro de enviar el correo a ' +
        user.persona?.nombre1 +
        ' ' +
        user.persona?.apellido1 +
        '?',
      header: 'Confirmación, de envió de los códigos Senescyt.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Enviar',
      rejectLabel: 'Cancelar',
      accept: () => {
        // alert()
        this.areaService
          .sendEmailCodigoSenescyt(user.idUsuario!, this.idDocumentoSenescyt!)
          .subscribe(
            (data) => {
              if (data != null) {
                data.estadoDocumento = !data.estadoDocumento; // Alternar el estado activo/desactivado

                this.documentoSenecytService
                  .updateDocumentoSenecyt(data.idDocumentoSenecyt!, data!)
                  .subscribe((data) => {
                    if (data != null) {
                      this.toastrService.success(
                        '',
                        'Correo electrónico enviado',
                        {
                          timeOut: 1000,
                        }
                      );
                      setTimeout(() => {
                        this.displayMaximizable = false;
                      }, 1000);
                    }
                  });
              }
            },
            (err) => {
              this.toastrService.error(
                'Intentalo más en la tarde.',
                'INCONVENIENTES.',
                {
                  timeOut: 1000,
                }
              );
            }
          );
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toastrService.info('', 'CORREO CANCELADO.', {
              timeOut: 1200,
            });

            break;
          case ConfirmEventType.CANCEL:
            this.toastrService.warning('', 'EN ESPERA DE ENVÍO.', {
              timeOut: 1200,
            });
            break;
        }
      },
    });
  }

  //TOMA DE CAPTURA DE LA PANTALLA
  imprimirTabla() {
    // window.print();
  }
}
