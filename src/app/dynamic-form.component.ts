import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionBase } from "./question-base";
import { QuestionControlService } from "./question-control.service";
import { Options } from "ng5-slider";
import { ChartOptions, ChartType, ChartDataSets } from 'chartjs';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import * as math from "mathjs";
import { multiply } from 'mathjs';

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {
  // inicio grafico
  // // grafico de barras
  public barChartOptions: ChartOptions = {
    responsive: true,
};
  public barChartLabels: Label[] = ['Comparação Valor da Fatura'];
  public barChartType: ChartType = 'bar';
 public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [ ];
  // // grafico de linhas
  public lineChartData: ChartDataSets[] = [ ];


  @Input() questions: QuestionBase<string>[] = [];
  form: FormGroup;
  payLoad = "";
  um = 0;
  dois = 0;
  sl = 0;
  multiplic = 0;
  somatoria = 0;

  // Variaveis gerais
  sliderPercentage: any = 0;

  // variaveis Tarfifas
  tarAzulKwrReatExe: any = 0; // lihnha 9
  tarAzulDemRegisPontaTusd: any = 0;
  tarAzulDemRegisForaPontaTusd: any = 0;

  // Variaveis histórico de consumo
  histValorFatura: any = 0;
  kwhPontaTusd: any = 0;
  kWPonta: any =0;
  //histCoRegistKwhPonta: any = 0;
  histDemanRegisKwForaPonta: any = 0;
  histCoKwhPontaTusd: any = 0; // linha 1
  histCoKwhForaPontaTusd: any = 3; //linha 2
  histCoTeAtivoPonta: any = 3; // linha 3
  histCoTeAtivoForaPonta: any = 0; //linha 4
  histCoReativoPonta: any = 3; // linha 5
  histCoReativoForaPonta: any = 3; //linha 6
  histAdicionalBandeirasPonta: any = 3; //linha 7
  histAdicionalBandeirasForaPonta: any = 3; //linha 8
  histDemReatExeForaPontaTusd: any = 0; //linha 9
  histDemRegisPontaTusd: any = 3; // linha 10

  demandaContatadaLimite: any = 0;
  // Init resultados operacoes
  op1: any = 3;
  op2: any = 3;
  op3: any = 3;
  op4: any = 3;
  op5: any = 3;
  op6: any = 3;
  op7: any = 3;
  op8: any = 3;
  op9: any = 3;
  op10: any = 3;
  op11: any = 3;
  op12: any = 3;
  op13: any = 3;
  op14: any = 3;

  // Init Calculos
  calc1: any = 3;
  calc2: any = 3;
  calc3: any = 3;
  calc4: any = 3;
  calc5: any = 3;
  calc6: any = 3;

  // Init lancamentos
  totalMes: any = 3;

  //simulacao azul
  //op1
  azulCoKwhPontaTusd: any = 3;
  tarAzulKwhPontaTusd: any = 0;
  //op2
  azulCoKwhForaPontaTusd: any = 3;
  tarAzulKwForaPontaTusd: any = 3;
  //op3
  azulCoTeAtivoPonta: any = 3;
  tarAzulKwTePonta: any = 3;
  //op4
  azulCoTeAtivoForaPonta: any = 3;
  tarAzulKwTEForaPonta: any = 3;

  //op5
  azulCoReaExePonta: any = 0;
  tarAzulKwhrTEPonta: any = 0;

  //op6
  azulCoReaExeForaPonta: any = 0;
  tarAzulKwhrTForaPonta: any = 0;

  //op7
  azulAdicionalBandPonta: any = 3;

  //op8
  azulAdicionalBandForaPonta: any = 3;

  //9
  azulDemReatExeForaPontaTusd: any = 0;

  //10
  azulDemRegisPontaTusd: any = 0;

  //11
  azulDemRegisForaPontaTusd: any = 0;

  //12
  azulUltrapassagemForaPonta: any = 3;

  //13
  azulOutros: any = 3;

  //14
  azulSimHisCoPontTusdXMult: any = 3;

  // variaveis perde-ganha
  perdeGanhaInicio: any = 0;
  perdeGanhaSimulado: any = 0;

  // simulation variables
  simulatedCoKwhPontaTusd: any = 0;
  simuladoValorTotal: any = 0;
  simulatedDemRegKwPontaTusd: any = 0;

  // variaveis simulacao grafico
  fatorVariacaoPonta: any = 0;
  margemDemandaContratada: any = 0;
  conRegisKwhPontaFloor: any = 0;
  conRegisKwhPontaCeil: any = 0;
  demanConsPonta: any = 0;
  value: any = 0;
  res = [];


  constructor(
    private qcs: QuestionControlService) {
    }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);

    // inicializar valores
    this.totalMes = "30666.18";
    this.getTarifasAzul();
    this.getHistoricoMes();
    this.destinoAzulStageOne();
    this.simularAumentoPonta()
 
/*
    this.value = 14;
    for (let i = 0; i < this.value ; i++) {
        this.res.push(i);
      }
      return this.res;
   */
  }

  onSubmit() {
    // this.soma();
    // this.payLoad = JSON.stringify(this.form.getRawValue());
    // console.log(this.payLoad);
    //this.destinoAzulStageOne();
     this.simularConsumoPonta();
   // console.log("res." + JSON.stringify(this.res));
   this.printResultado();
  }

  // buscar nos lancamentos do mes os valores em kwh que serao multiplicados com as tarifas 
  getHistoricoMes() {
    this.histValorFatura =  30666.18;
    this.kwhPontaTusd = 146.60;
    this.kWPonta = 41.6531028903238
    this.histDemanRegisKwForaPonta = 146.60;
    this.histCoKwhPontaTusd =  1779;  // linha 1
    this.histCoKwhForaPontaTusd =  54358; //linha 2
    this.histCoTeAtivoPonta = 1779; //linha 3
    this.histCoTeAtivoForaPonta = 54357; //linha 4
    this.histCoReativoPonta = 338; // linha 5
    this.histCoReativoForaPonta = 7486; // linha 6
    // linha 7 op 7 é valor em real nao entra
    // linha 8 op 8 é valor em real nao entra
    this.histDemReatExeForaPontaTusd = 18.24; //linha 9
    this.histDemRegisPontaTusd = 0; // linha 10
    this.histDemanRegisKwForaPonta = 146.60; //linha 11
    this.demandaContatadaLimite = 130;


    // valores do historico que sao valores em dinheiro e nao sao calculados
    this.histAdicionalBandeirasPonta = 31.50; //linha 7
    this.histAdicionalBandeirasForaPonta = 1444.49; //linha 8
  }

  // Busca os valores das tarifas no datalabels
  // // deve receber como parâmetro
  // // // distribuidora
  // // // mes
  getTarifasAzul( ) {
    this.tarAzulKwhPontaTusd = 0.082123123; //op1 linha1
    this.tarAzulKwForaPontaTusd = 0.0826473; //op2 linha2
    this.tarAzulKwTePonta = 0.47362066; // op3 linha3
    this.tarAzulKwTEForaPonta = 0.2874082; //op4 linha4
    this.tarAzulKwhrTEPonta = 0.30292613; //op5 linha5
    this.tarAzulKwhrTForaPonta = 0.30292023; // op6 linha6 
    // op7 bandeiras ponta vem direto do Historico
    // op8 bandeiras fora ponta vem direto do Historico
    this.tarAzulKwrReatExe = 19.5772335; // op9 linha9
    this.tarAzulDemRegisPontaTusd = 41.6531028903238; //op10 linha10
    this.tarAzulDemRegisForaPontaTusd = 19,57733126; //op11 linha11
 }
  


  soma() {
    console.log(this.form.getRawValue().origem);
    this.um = this.form.getRawValue().origem;
    this.dois = this.form.getRawValue().origemdois;
    this.multiplic = this.form.getRawValue().multiplication;
    this.sl = this.form.getRawValue().slider;
    console.log(this.sl);
    console.log("um..." + this.um);
    console.log("dois..." + this.dois);
    this.somatoria = +this.um + +this.dois;
    console.log(this.somatoria);
    console.log(this.um * this.multiplic);
  }

  destinoAzulStageOne() {
    //operacao 1
    this.azulCoKwhPontaTusd = math.multiply(this.histCoKwhPontaTusd, this.tarAzulKwhPontaTusd);
    //console.log("p1 = " + this.histCoKwhPontaTusd);
    //console.log("p2 = " + this.tarAzulKwhPontaTusd);
    this.op1 = this.azulCoKwhPontaTusd;
    console.log("op1 = " + this.azulCoKwhPontaTusd );

    //operacao 2
    this.azulCoKwhForaPontaTusd =
    math.multiply(this.tarAzulKwForaPontaTusd, this.histCoKwhForaPontaTusd);
    this.op2 = this.azulCoKwhForaPontaTusd;
    console.log("op2 = " + this.azulCoKwhForaPontaTusd);

    //operacao 3
    this.azulCoTeAtivoPonta = math.multiply(this.histCoTeAtivoPonta, this.tarAzulKwTePonta);
    this.op3 = this.azulCoTeAtivoPonta;
    console.log("op3 = " + this.azulCoTeAtivoPonta);

    //operacao 4
    this.azulCoTeAtivoForaPonta =
    math.multiply(this.histCoTeAtivoForaPonta, this.tarAzulKwTEForaPonta);
    this.op4 = this.azulCoTeAtivoForaPonta;
    console.log("op4 = " + this.azulCoTeAtivoForaPonta);

    //operacao 5
    this.azulCoReaExePonta = 
    math.multiply(this.histCoReativoPonta, this.tarAzulKwhrTEPonta);
    this.op5 = this.azulCoReaExePonta;
    console.log("op5 = " + this.azulCoReaExePonta);

    //operacao 6
    this.azulCoReaExeForaPonta =
    math.multiply(this.histCoReativoForaPonta, this.tarAzulKwhrTForaPonta);
    this.op6 = this.azulCoReaExeForaPonta;
    console.log("op6 = " + this.azulCoReaExeForaPonta);
    
    //operacao 7
    this.azulAdicionalBandPonta = this.histAdicionalBandeirasPonta;
    this.op7 = this.azulAdicionalBandPonta;
    console.log("op7 = " + this.azulAdicionalBandPonta);

    //operacao 8
    this.azulAdicionalBandForaPonta = this.histAdicionalBandeirasForaPonta;
    this.op8 = this.azulAdicionalBandForaPonta;
    console.log("op8 = " + this.azulAdicionalBandForaPonta);

    //operacao 9
    this.azulDemReatExeForaPontaTusd = 
    math.multiply(this.histDemReatExeForaPontaTusd,this.tarAzulKwrReatExe);
    this.op9 = this.azulDemReatExeForaPontaTusd;
    console.log("op9 = " + this.azulDemReatExeForaPontaTusd );


    //operacao 10 somente simulacao azul (essa 10 ta na ordem errada tinha que ser a9)
    this.azulDemRegisPontaTusd = 
    math.multiply(this.histDemRegisPontaTusd, this.tarAzulDemRegisPontaTusd);
    this.op10 = this.azulDemRegisPontaTusd;
    console.log("op10 = " + this.azulDemRegisPontaTusd);

    //operacao 11
    this.azulDemRegisForaPontaTusd = 
    math.multiply(this.histDemanRegisKwForaPonta, this.tarAzulDemRegisForaPontaTusd);
    this.op11 = this.azulDemRegisForaPontaTusd;
    console.log("op11 = " + this.azulDemRegisForaPontaTusd);

    //operacao 12
    this.azulUltrapassagemForaPonta = 649.96;
    this.op12 = this.azulUltrapassagemForaPonta;

    //operacao 13
    this.azulOutros = 31.9;
    this.op13 = this.azulOutros;

    //opecacao 14 (calculo 1)
    this.azulSimHisCoPontTusdXMult = "2222";

    // Calculos
    // calculo 1
    // soma inicial sem fator multiplicacao
    this.calc1 =
      this.op1 +
      this.op2 +
      this.op4 +
      this.op5 +
      this.op6 +
      this.op7 +
      this.op8 +
      this.op9 +
      this.op10 +
      this.op11 +
      this.op12 +
      this.op13;
    console.log(this.calc1);

    // calcular primeiro perde ganha perdeGanhaInicio
    // // pegar o valor da conta do mes totalMes
    // // subtrair o valor da primeira simulacao calc1
    this.perdeGanhaInicio = this.histValorFatura - this.calc1;

    // chamar a simularConsumoPonta
    this.simularConsumoPonta();
  }

  // calculo 2
  // Simulcao Amento Consumo Ponta tusd
  // Historico consumo ponta X multiplicador
  simularConsumoPonta() {
    // pergar o valor do slider mostrar como porcentagem
    this.sliderPercentage = this.form.getRawValue().slider;
    // criar o valor da multiplcacao
    this.sl = this.form.getRawValue().slider / 100;
    // pegar kW FPonta Registrado no historico de consumo fora ponta do mes
    // multiplicar e passar para a variaver calc3
    this.calc3 = this.kwhPontaTusd * this.sl;
    // criar variavel simulatedCoKwhPontaTusd
    this.simulatedCoKwhPontaTusd = (this.calc3 * 3) * 20;
    this.calc2 =  this.simulatedCoKwhPontaTusd * this.tarAzulKwhPontaTusd;
    // calcular consumo te ativo ponta e passar para a variavel calc5
    // // multiplicar o consulmo simulado pela tarifa
    this.calc5 = this.calc2 * this.tarAzulKwTePonta;
    // calcular Demanda Registrada kW - TUSD PONTA
    // // obter valor multiplicador calc3
    // // buscar no historico kWPonta
    this.simulatedDemRegKwPontaTusd = this.calc3 * this.kWPonta;
    // chavamar a funçao que soma tudo
    this.simularValorConta();
  }

  // calculo 3
  // valor da conta simulada
  simularValorConta() {
  // // passo 1
  // // somar os valores que não mudam e passar para  a viriavel calc4
  this.calc4 = 
    this.op2 +
    this.op4 +
    this.op5 +
    this.op6 +
    this.op7 +
    this.op8 +
    this.op9 +
    this.op11 +
    this.op12 +
    this.op13;
  
  // // somar com os valores alteados pelo slider
  this.simuladoValorTotal =  
    this.calc2 +
    this.calc4 +
    this.calc5 +
    this.simulatedDemRegKwPontaTusd

  // calcular perde ganha simulado
  // // pegar valor da conta mes anterior histValorFatura
  // // subtrair o valor total simulado simuladoValorTotal
  this.perdeGanhaSimulado = this.histValorFatura - this.perdeGanhaSimulado
  // Graficos Perde perde
  this.plotBarChart();
  }
  plotBarChart() {
   this.barChartData = [    
   { data: [this.histValorFatura], label: 'Total Inicial' },
   { data: [this.calc1], label: 'Simulado Base' },
   { data: [this.simuladoValorTotal], label: 'Simulado Ponta' }]
  }

  // Simular resultados do aumento do consumo na ponta e plotar no gráfico 
  // alteracoes no valor da conta e disponibilidade energética
  // esta funcao recebe os seguintes parametros:
  // 1. histDemanRegisKwForaPorta => demanda registrada fora ponta kw  (origem: historico)
  // 2. fatorVariacaoPonta (calcular)
  // 3. demandaContatada => demanda contratada limite (origem: conta de energia)
  // 4. histCoRegistKwhPonta (origem: histórico)
  // 5. margemDemandaContratada (calcular)
  // 6. conRegisKwhPontaFloor (calcular -> histCoRegistKwhPonta - margemDemandaContratada)
  // 6. conRegisKwhPontaCeil (calcular -> histCoRegistKwhPonta + margemDemandaContratada)
  // 7. demanConsPonta (calcular -> var = demanConsPonta -> demandaContatadaLimite * fatorVariacaoPonta /100)
  // 8. demandaContatadaLimite (associacao -> histDemanRegisKwForaPorta)
  simularAumentoPonta() {
    console.log("chamou"); 
    // passo 1 - obter variaveis do db 
    /*  ### obtidas na funcao   getHistoricoMes (aqui como ref) ###
      histDemanRegisKwForaPorta: any = 0;
      histCoRegistKwhPonta: any = 0;
      demandaContatadaLimite: any = 0;
    */
    // passo 2 - calcular variaveis locais
    console.log(this.histCoKwhPontaTusd);
    this.margemDemandaContratada = (this.histCoKwhPontaTusd / 100) * 5;
    console.log(this.margemDemandaContratada);
    this.conRegisKwhPontaFloor = this.histCoKwhPontaTusd -  this.margemDemandaContratada;
    this.conRegisKwhPontaCeil = this.histCoKwhPontaTusd +  this.margemDemandaContratada;
    console.log(this.conRegisKwhPontaCeil);
   
    // passo 3 - calcular array de resultados
    // // loop:
    // // setar o fatorVariacaoPonta para 1% e multiplicar pela demandaContatadaLimite
    // // enquanto o fatorVariacaoPonta em porcentagem ( *3 * 22 ) for menor ou igual ao intervalo  this.conRegisKwhPontaFloor::this.conRegisKwhPontaCeil
    // // adicionar o fator ao array 
    // // adicionar 1% e recomecar
    //  // passo 4 - popular array
    // // ao fim do loop calcular o valor da fatura e disponibilidade energetica
    this.value = this.conRegisKwhPontaCeil;
    for (let i = 0; i < this.value; i++) {
        this.res.push(i);
      }
      return this.res;
   
  
    // passo 5 - passar dados para o grafico de linhas
    /*
  this.lineChartData = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Valor Fatura' },
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Disponibilidade Energetica' },
  ];
    */
    
  }
  printResultado() {
    console.log("hello" + JSON.stringify(this.res));
  }
  
  
}
