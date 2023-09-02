import { FormatarMoeda, FormatarData } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";

let saldo = 3000;

const elementoSaldo = document.querySelector(
  ".saldo-valor .valor"
) as HTMLElement;

const elementoDataAcesso = document.querySelector(
  ".block-saldo time"
) as HTMLElement;

const dataAcesso: Date = new Date();
elementoDataAcesso.textContent = FormatarData(
  dataAcesso,
  FormatoData.DIA_SEMANA_DIA_MES_ANO
);

AtualizarSaldo(saldo);

export function GetSaldo(): number {
  return saldo;
}

export function AtualizarSaldo(novoSaldo: number): void {
  saldo = novoSaldo;
  if (elementoSaldo != null) elementoSaldo.textContent = FormatarMoeda(saldo);
}
