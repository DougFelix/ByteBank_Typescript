import { FormatarData } from "../utils/formatters.js";
import { Armazenador } from "./Armazenador.js";
import { FormatoData } from "./FormatoData.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

export class Conta {
  protected nome: string;
  protected saldo: number = Armazenador.Obter<number>("saldo") || 0;
  private transacoes: Transacao[] =
    Armazenador.Obter<Transacao[]>("transacoes", (key: string, value: any) => {
      if (key === "data") {
        return new Date(value);
      }
      return value;
    }) || [];

  constructor(nome: string) {
    this.nome = nome;
  }

  public GetTitular() {
    return this.nome;
  }

  GetSaldo() {
    return this.saldo;
  }

  GetDataAcesso(): Date {
    return new Date();
  }

  private Debitar(valor: number): void {
    if (valor <= 0) {
      throw new Error("O valor a ser debitado deve ser maior que zero!");
    }
    if (valor > this.saldo) {
      throw new Error("Saldo insuficiente!");
    }

    this.saldo -= valor;
    Armazenador.Salvar("saldo", this.saldo.toString());
  }

  private Depositar(valor: number): void {
    if (valor <= 0) {
      throw new Error("O valor a ser depositado deve ser maior que zero!");
    }

    this.saldo += valor;
    Armazenador.Salvar("saldo", this.saldo.toString());
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
    Armazenador.Salvar("transacoes", JSON.stringify(this.transacoes));
  }

  AgruparTransacoes(): ResumoTransacoes {
    const listaTransacoes: Transacao[] = structuredClone(this.transacoes);
    const resumoTransacoes: ResumoTransacoes = {
      totalDepositos: 0,
      totalPagamentosBoleto: 0,
      totalTransferencias: 0,
    };
    for (let transacao of listaTransacoes) {
      if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
        resumoTransacoes.totalDepositos += transacao.valor;
      } else if (transacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
        resumoTransacoes.totalPagamentosBoleto += transacao.valor;
      } else if (transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA) {
        resumoTransacoes.totalTransferencias += transacao.valor;
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

export class ContaPremium extends Conta {
    RegistrarTransacao(transacao: Transacao) : void {
        if(transacao.tipoTransacao === TipoTransacao.DEPOSITO){
            console.log("Ganhou um bonus de 0,50 centavos!");
            transacao.valor += 0.5;
        }
        super.RegistrarTransacao(transacao);
    }
}

const conta = new Conta("Joana da Silva Oliveira");
const contaPremium = new ContaPremium("Douglas");
console.log(conta.GetTitular());

export default conta;
