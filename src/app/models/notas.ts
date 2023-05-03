import { ParticipantesMatriculados } from "./participantesMatriculados";

export class Notas {
    idNota?: number;
    parcial?: number;
    examenFinal?: number;
    fechaNota?: Date;
    observacion?: string;
    partipantesMatriculados?: ParticipantesMatriculados;
}

