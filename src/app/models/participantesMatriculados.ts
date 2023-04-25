import { Matricula } from "./matricula";

export class ParticipantesMatriculados{
    idParticipanteMatriculado?:number;
    
    estadoParticipanteActivo?: Boolean;
    estadoParticipanteAprobacion?:string;

   //idMatricula?: number;

   matricula?:Matricula;
}