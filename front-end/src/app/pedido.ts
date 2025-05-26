import { Cliente } from "./cliente";
import { Morada } from "./morada";
import { Turno } from "./turno";

export interface Pedido {
    _id: string;
    moradaInicio: Morada;
    moradaFim: Morada;
    cliente: Cliente;
    numeroPessoas: number;
    aceiteMotorista: boolean; 
    aceiteCliente: boolean; 
    pedidoConcluido: boolean; 
    motoristaQueAceitou: string;
    distancia?: number;
    motoristasRejeitados: string[];
    turno?: Turno| string | null;
    distanciaDestino?: number;
    nivelDeConforto: string;
  }
  