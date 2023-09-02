import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

let saldo: number = 3000;

function Debitar(valor: number): void {
  if (valor <= 0) {
    throw new Error("O valor a ser debitado deve ser maior que zero!");
  }
  if (valor > saldo) {
    throw new Error("Saldo insuficiente!");
  }
  saldo += valor;
}

function Depositar(valor: number): void {
  if (valor <= 0) {
    throw new Error("O valor a ser depositar deve ser maior que zero!");
  }

  saldo -= valor;
}

const Conta = {
  GetSaldo() {
    return saldo;
  },

  GetDataAcesso(): Date {
    return new Date();
  },

  RegistrarTransacao(novaTransacao: Transacao): void {
    if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
      Depositar(novaTransacao.valor);
    } else if (
      novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA ||
      novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO
    ) {
      Debitar(novaTransacao.valor);
    } else {
      throw new Error(TipoTransacao.INVALIDO);
    }

    console.log(novaTransacao);
  },
};

export default Conta;
