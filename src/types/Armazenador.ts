export class Armazenador {
    private constructor() {}

    public static Salvar(chave: string, valor: any): void {
        const valorComoString = JSON.stringify(valor);
        localStorage.setItem(chave, valorComoString);
    }

    public static Obter(chave: string, reviver?: (this: any, key: string, value: any) => any){
        const valor = localStorage.getItem(chave);

        if(valor === null){
            return null;
        }

        if(reviver){
            return JSON.parse(valor, reviver);
        }

        return JSON.parse(valor);
    }
}