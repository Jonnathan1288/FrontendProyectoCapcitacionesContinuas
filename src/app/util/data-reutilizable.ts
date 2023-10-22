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
            absolutePosition: { x: -560, y: 10 },
            image: image2,
            width: 150,
            height: 40,
            alignment: 'center',
        },
        {
            text: 'INSTITUTO SUPERIOR UNIVERSITARIO',
            bold: true,
            size: 20,
            alignment: 'center',
        },
        {
            text: 'TECNOLÓGICO "DEL AZUAY"',
            bold: true,
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
        {
            text: '',
            margin: [0, 5],
        },

    ];
}

export const EXPORT_DATE_NOW = new Date().toLocaleDateString();