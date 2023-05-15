import { Usuario } from "./usuario";

export class DocumentoSenecyt {
  idDocumentoSenecyt?: number;
  descripcion?: string;
  documentoExel?: string;
  estadoDocumento?: boolean;
  fechaCreacion?: Date;
  usuario?: Usuario
  
}
