import { LocalStorageKeys } from "./local-storage-manager";

export function generateCustomContent(imageDataUrl: string, image2: string) {
    return [
        {
            absolutePosition: { x: 720, y: 10 },
            image: imageDataUrl,
            width: 70,
            height: 40,
            alignment: 'center',
        },
        {
            absolutePosition: { x: -610, y: 10 },
            image: image2,
            width: 70,
            height: 40,
            alignment: 'center',
        },
        {
            text: 'INSTITUTO SUPERIOR UNIVERSITARIO',
            style: 'header',
            alignment: 'center',

        },
        {
            text: 'TECNOLÓGICO "DEL AZUAY"',
            style: 'header',
            alignment: 'center',

        },
        {
            text: 'FORMULARIO: D2',
            style: 'header',
            alignment: 'center',
            margin: [0, 3],
            fontSize: 7
        },
        {
            text: 'REGISTRO DE ASISTENCIA Y EVALUACIÓN',
            style: 'header',
            alignment: 'center',
            bold: true,
            margin: [0, 3],
        },
        // {
        //     text: `Fecha de Exportación: ${EXPORT_DATE_NOW}`,
        //     style: 'subheader',
        //     alignment: 'left',
        //     margin: [0, 3],
        // },
        // {
        //     text: `Exportado por: ${getUserName(LocalStorageKeys.USER_NAME)}`,
        //     style: 'subheader',
        //     alignment: 'left',
        //     margin: [0, 3],
        // },
        // {
        //     text: nameReport,
        //     style: 'header',
        //     alignment: 'center',
        //     margin: [0, 10],
        // },
    ];
}
