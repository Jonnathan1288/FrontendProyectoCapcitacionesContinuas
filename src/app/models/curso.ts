import { Capacitador } from './capacitador';
import { Especialidad } from './especialidad';
import { HorarioCurso } from './horario-curso';
import { ModalidadCurso } from './modalidad-curso';
import { NivelCurso } from './nivel-curso';
import { Parroquia } from './parroquia';
import { Programas } from './programa';
import { TipoCurso } from './tipo-curso';

export class Curso {
  idCurso?: number;
  nombreCurso?: string; //
  fotoCurso?: string; //no
  duracionCurso?: number; //
  observacionCurso?: string; //
  estadoCurso?: boolean;
  estadoAprovacionCurso?: string;
  estadoPublicasionCurso?: string;
  descripcionCurso?: string;
  objetivoGeneralesCurso?: string;
  numeroCuposCurso?: number;
  fechaInicioCurso?: Date;
  fechaFinalizacionCurso?: Date;
  programas?: Programas;
  cursoocc?: string;
  codigoCurso?: string;
  especialidad?: Especialidad;
  capacitador?: Capacitador;
  modalidadCurso?: ModalidadCurso;
  tipoCurso?: TipoCurso;
  nivelCurso?: NivelCurso;
  horarioCurso?: HorarioCurso;
  parroquia?: Parroquia;
  // iniciocurso?: boolean
}
