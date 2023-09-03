import { FormatarData } from "../utils/formatters.js";
import { FormatoData } from "./FormatoData.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

export class Conta {
  nome: string;
  saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
  transacoes: Transacao[] =
    JSON.parse(
      localStorage.getItem("transacoes"),
      (key: string, value: any) => {
        if (key === "data") {
          return new Date(value);
        }
        return value;
      }
    ) || [];

  constructor(nome: string) {
    this.nome = nome;
  }

  GetSaldo() {
    return this.saldo;
  }

  GetDataAcesso(): Date {
    return new Date();
  }

  Debitar(valor: number): void {
    if (valor <= 0) {
      throw new Error("O valor a ser debitado deve ser maior que zero!");
    }
    if (valor > this.saldo) {
      throw new Error("Saldo insuficiente!");
    }
  
    this.saldo -= valor;
    localStorage.setItem("saldo", this.saldo.toString());
  }
  
  Depositar(valor: number): void {
    if (valor <= 0) {
      throw new Error("O valor a ser depositado deve ser maior que zero!");
    }
  
    this.saldo += valor;
    localStorage.setItem("saldo", this.saldo.toString());
  }

  RegistrarTransacao(novaTransacao: Transacao): void {
    if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
        this.Depositar(novaTransacao.valor);
    } else if (
      novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
      novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO
    ) {
        this.Debitar(novaTransacao.valor);
      novaTransacao.valor *= -1;
    } else {
      throw new Error(TipoTransacao.INVALIDO);
    }

    this.transacoes.push(novaTransacao);
    console.log(this.GetGruposTransacoes());
    localStorage.setItem("transacoes", JSON.stringify(this.transacoes));
  }

  AgruparTransacoes(): ResumoTransacoes {
    const listaTransacoes: Transacao[] = structuredClone(this.transacoes);
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

  GetGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes: Transacao[] = structuredClone(this.transacoes);
    const transacoesOrdenadas: Transacao[] = listaTransacoes.sort(
      (t1, t2) => t2.data.getTime() - t1.data.getTime()
    );
    let labelAtualGrupoTransacao: string = "";

    for (let transacao of transacoesOrdenadas) {
      let labelGrupoTransacao: string = FormatarData(
        transacao.data,
        FormatoData.MES_ANO
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
  }
}


const conta = new Conta("Joana da Silva Oliveira");

export default conta;
