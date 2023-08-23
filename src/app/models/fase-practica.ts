import { DisenioCurriculares } from "./disenio-curriculares"
import { Instalacion } from "./instalacion"
import { Recurso } from "./recurso"

export class FasePractica {
    idFasePractica?: number
    nombreFase?: string
    estado?: boolean
    instalacion?: Instalacion
    recurso?: Recurso
    disenioCurricular?: DisenioCurriculares
}
