import Conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { GrupoTransacao } from "../types/GrupoTransacao.js";
import { FormatarData, FormatarMoeda } from "../utils/formatters.js";

const elementoRegistroTransacoesExtrato: HTMLElement = document.querySelector(
  ".extrato .registro-transacoes"
);

RenderizarExtrato();

function RenderizarExtrato(): void {
  const gruposTransacoes: GrupoTransacao[] = Conta.GetGruposTransacoes();
  elementoRegistroTransacoesExtrato.innerHTML = "";
  let htmlRegistroTransacoes: string = "";

  for (let grupoTransacao of gruposTransacoes) {
    let htmlTransacaoItem: string = "";
    for (let transacao of grupoTransacao.transacoes) {
      htmlTransacaoItem += `
                <div class="transacao-item">
                    <div class="transacao-info">
                        <span class="tipo">${transacao.tipoTransacao}</span>
                        <strong class="valor">${FormatarMoeda(
                          transacao.valor
                        )}</strong>
                    </div>
                    <time class="data">${FormatarData(
                      transacao.data,
                      FormatoData.DIA_MES
                    )}</time>
                </div>
            `;
    }

    htmlRegistroTransacoes += `
            <div class="transacoes-group">
                <strong class="mes-group">${grupoTransacao.label}</strong>
                ${htmlTransacaoItem}
            </div>
        `;
  }

  if (htmlRegistroTransacoes === "") {
    htmlRegistroTransacoes = "<div>Não há transações registradas.</div>";
  }

  elementoRegistroTransacoesExtrato.innerHTML = htmlRegistroTransacoes;
}

const ExtratoComponent = {
  Atualizar(): void {
    RenderizarExtrato();
  },
};

export default ExtratoComponent;
