import { FormatoData } from "../types/FormatoData.js";

export function FormatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}

export function FormatarData(
  data: Date,
  formato: FormatoData = FormatoData.PADRAO
): string {
  if ((formato = FormatoData.DIA_SEMANA_DIA_MES_ANO)) {
    return data.toLocaleDateString("pt-br", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } else if ((formato = FormatoData.DIA_MES)) {
    return data.toLocaleDateString("pt-br", {
      day: "2-digit",
      month: "2-digit",
    });
  } else if ((formato = FormatoData.MES_ANO)){
    return data.toLocaleDateString("pt-br", {
      month: "long",
      year: "numeric"
    })
  } 
  else if ((formato = FormatoData.PADRAO)) {
    return data.toLocaleDateString("pt-br");
  }
}
