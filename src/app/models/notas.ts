import { ParticipantesMatriculados } from "./participantesMatriculados";

export class Notas {
    idNota?: number;
    parcial?: number;
    examenFinal?: string;
    fechaNota?: Date;
    observacion?: string;
    participanteMatriculado?: ParticipantesMatriculados;
}

