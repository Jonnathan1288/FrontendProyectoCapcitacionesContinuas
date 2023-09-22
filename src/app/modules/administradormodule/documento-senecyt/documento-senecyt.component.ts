import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { DocumentoSenecytService } from 'src/app/service/documento-senecyt.service';
import { DocumentoSenecyt } from 'src/app/models/documento-senecyt';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ConfirmationService } from 'primeng/api';
import { UploadService } from 'src/app/service/upload.service';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageKeys, getToken } from 'src/app/util/local-storage-manager';

@Component({
    selector: 'app-documento-senecyt',
    templateUrl: './documento-senecyt.component.html',
    styleUrls: ['./documento-senecyt.component.css'],
    providers: [ConfirmationService],
})
export class DocumentoSenecytComponent implements OnInit {

    public listDocumentoExel: DocumentoSenecyt[] = [];
    public classDocumentoExel = new DocumentoSenecyt();
    public idUsuarioLocal?: any;
    public classUsuario = new Usuario();
    constructor(
        private toastrService: ToastrService,
        private documentoSenecytService: DocumentoSenecytService,
        private usuarioServcie: UsuarioService,
        private uploadService: UploadService
    ) { }

    ngOnInit(): void {
        this.idUsuarioLocal = localStorage.getItem('id_username');
        this.obtenerTodosLosDocumentosExel();
        try {
            this.classUsuario.idUsuario = parseInt(localStorage.getItem('id_username')!);
        } catch (error) {
            this.obtenerUsuario(this.idUsuarioLocal);
        }

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

            }
        });
    }

    public selectedFile!: File;
    public onFileSelected(event: any) {
        let data = event.target.files[0];

        if (data.size >= 1048576) {
            this.toastrService.error('', 'ARCHIVO MUY GRANDE.', { timeOut: 2000 });
            return;
        }

        this.selectedFile = data;
    }

    public validacionDocumentosExel() {
        if (
            !this.classDocumentoExel.descripcion
        ) {
            this.toastrService.error(
                'Campo vacío o no esta seleccionado el documento Excel..',
                'CAMPOS VACIOS'
            );
        } else {
            this.createUpdateDocumentoExel();
        }
    }

    public async createUpdateDocumentoExel() {
        if (this.classDocumentoExel.idDocumentoSenecyt) {

            if (this.selectedFile) {
                try {
                    this.classDocumentoExel.documentoExel = await this.uploadImage();
                } catch (error) {
                    this.toastrService.error(
                        '',
                        'INCONVENIENTE AL ACTUALIZAR EL DOCUMENTO'
                    );
                    this.clenaData();
                }
            }
            this.documentoSenecytService
                .updateDocumentoSenecyt(
                    this.classDocumentoExel.idDocumentoSenecyt!,
                    this.classDocumentoExel
                )
                .subscribe({
                    next: (resp) => {
                        this.toastrService.success(
                            'El documento a sido actualizado correctamente.',
                            'DOCUMENTO ACTUALIZADO'
                        );

                        const index = this.listDocumentoExel.findIndex(e => e.idDocumentoSenecyt === resp.idDocumentoSenecyt);
                        this.listDocumentoExel[index] = resp;

                        this.clenaData();
                    },
                    error: (err) => {
                        this.toastrService.error(
                            '',
                            'INCONVENIENTE AL ACTUALIZAR EL DOCUMENTO'
                        );
                    }

                });


        } else {

            this.uploadService.upload(this.selectedFile, "documents").subscribe({
                next: (resp) => {
                    this.classDocumentoExel.documentoExel = resp.key;
                    this.classDocumentoExel.estadoDocumento = false;
                    this.documentoSenecytService
                        .saveDocumentoSenecyt(this.classDocumentoExel)
                        .subscribe((data) => {
                            if (data != null) {
                                this.toastrService.success(
                                    'El documento a sido creado correctamente.',
                                    'DOCUMENTO CREADO'
                                );
                                this.listDocumentoExel.push(data)
                                this.clenaData();
                            }
                        });
                }, error: (err) => {
                    this.toastrService.error(
                        '',
                        'INCONVENIENTE AL SUBIR EL DOCUMENTO'
                    );
                    this.clenaData();
                }
            })


        }
    }

    public async uploadImage() {
        try {
            const result = await this.uploadService
                .upload(this.selectedFile, "documents")
                .toPromise();
            return result.key;
        } catch (error) {
            console.error('new income');
        }

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
    public visible?: boolean;
    public showModaL() {
        this.visible = true;
    }

    public clenaData() {
        this.classDocumentoExel = {} as DocumentoSenecyt;
        this.selectedFile = {} as File;
        this.visible = false;
    }

}
