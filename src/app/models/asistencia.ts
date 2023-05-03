import { ParticipantesMatriculados } from './participantesMatriculados';

export class Asistencia {
  idAsistencia?: number;
  fechaAsistencia?: Date;
  estadoAsistencia?: boolean;
  observacionAsistencia?: string;
  partipantesMatriculados?: ParticipantesMatriculados;
}
