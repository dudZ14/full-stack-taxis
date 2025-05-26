import { Cliente } from "./cliente";
import { Morada } from "./morada";
import { Pedido } from "./pedido";
import { Periodo } from "./periodo";

export interface Viagem {
    _id?: string;
    pedido: Pedido;
    periodo: Periodo;
    moradaInicio: Morada;
    moradaFim?: Morada;
    numeroSequencia: number;
    numeroPessoas: number;
    distancia: number;
    custo?: number; 
  }
  