import { Curso } from './curso';
import { Usuario } from './usuario';

export class Inscrito {
  idInscrito?: number;
  fechaInscrito?: Date;
  estadoInscrito?: Boolean;
  estadoInscritoActivo?: Boolean;
  usuario?: Usuario;
  curso?: Curso;
}
