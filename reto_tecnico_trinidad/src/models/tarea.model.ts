import { Subscription } from "rxjs";

export interface Tarea {
    id: number;
    descripcion: string;
    tiempo?: number | null;
    check?: boolean;
    estado?: number;
    subscription?: Subscription;
}