import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { FormatarData } from "../utils/formatters.js";
import { FormatoData } from "./FormatoData.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes: Transacao[] =
  JSON.parse(
    localStorage.getItem("transacoes"),
    (key: string, value: string) => {
      if (key === "data") {
        return new Date(value);
      }

      return value;
    }
  ) || [];

function Debitar(valor: number): void {
  if (valor <= 0) {
    throw new Error("O valor a ser debitado deve ser maior que zero!");
  }
  if (valor > saldo) {
    throw new Error("Saldo insuficiente!");
  }

  saldo -= valor;
  localStorage.setItem("saldo", saldo.toString());
}

function Depositar(valor: number): void {
  if (valor <= 0) {
    throw new Error("O valor a ser depositado deve ser maior que zero!");
  }

  saldo += valor;
  localStorage.setItem("saldo", saldo.toString());
}

const Conta = {
  GetSaldo() {
    return saldo;
  },

  GetDataAcesso(): Date {
    return new Date();
  },

  GetGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes: Transacao[] = structuredClone(transacoes);
    const transacoesOrdenadas: Transacao[] = listaTransacoes.sort(
      (t1, t2) => t2.data.getTime() - t1.data.getTime()
    );
    let labelAtualGrupoTransacao: string = "";

    for (let transacao of transacoesOrdenadas) {
      let labelGrupoTransacao: string = FormatarData(
        transacao.data,
        FormatoData.DIA_MES
      );
      if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
        labelAtualGrupoTransacao = labelGrupoTransacao;
        gruposTransacoes.push({
          label: labelGrupoTransacao,
          transacoes: [],
        });
      }
      gruposTransacoes.at(-1).transacoes.push(transacao);
    }

    return gruposTransacoes;
  },

  RegistrarTransacao(novaTransacao: Transacao): void {
    if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
      Depositar(novaTransacao.valor);
    } else if (
      novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
      novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO
    ) {
      Debitar(novaTransacao.valor);
      novaTransacao.valor *= -1;
    } else {
      throw new Error(TipoTransacao.INVALIDO);
    }

    transacoes.push(novaTransacao);
    console.log(this.GetGruposTransacoes());
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  },

  AgruparTransacoes(): ResumoTransacoes {
    const listaTransacoes: Transacao[] = structuredClone(transacoes);
    const resumoTransacoes: ResumoTransacoes = {
        totalDepositos: 0,
        totalPagamentosBoleto: 0,
        totalTransferencias: 0
    };
    for(let transacao of listaTransacoes){
        if(transacao.tipoTransacao === TipoTransacao.DEPOSITO){
            resumoTransacoes.totalDepositos += transacao.valor
        }
        else if(transacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO){
            resumoTransacoes.totalPagamentosBoleto += transacao.valor
        }
        else if(transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA){
            resumoTransacoes.totalTransferencias += transacao.valor
        }
    }
    return resumoTransacoes;
  }

};

export default Conta;
