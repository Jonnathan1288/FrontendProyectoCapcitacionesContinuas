import { Silabo } from "./silabo";

export class Contenidosilabos {

    idContenidoSilabo?: number;
    temaContenido?: string;
    diaContenido?: number;
    horasClaseContenido?: number;
    horasTalleres?: number;
    actividadesDocencia?: string;
    horasPracticas?: number;
    actividadesPracticas?: string;
    horasAutonomas?: number;
    actividadesAutonomas?: string;
    observaciones?: string;
    estadoContenido?: Boolean;
    silabo?: Silabo;
}
