import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.component.html',
  styleUrls: ['./visualizar.component.scss']
})

export class VisualizarComponent implements OnInit {
  public idPedido: any;
  public pedido: any;
  public mostrarAlert = false;
  public msgAlert = ''
  public styleAlert = "alert alert-primary";
  public displayQuantidade = "none";
  public quantidade  = 0;
  public itensPedido: any[]=[];
  public idProduto = 0;
  public idItemPedido = 0;
  public nomeProduto: string = '';

  constructor(private pedidosService: PedidosService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute)
    {
      console.log(this.activeRoute.snapshot.params['id']);
      this.idPedido = this.activeRoute.snapshot.params['id'];
     }

  ngOnInit(): void {
    this.getPedido();
  }

  getPedido()
  {
    this.pedidosService.getPedido(this.idPedido)
    .subscribe(
     response => {
      this.pedido =  response;
      console.log(this.pedido);
     },
     error => {
       console.log(error);
       this.styleAlert = 'alert alert-error';
       this.mostrarMesagem('Ocorreu um erro ao recuperar o pedido!');
     });
  }

  alterarPedido()
  {
    let form ={
      id: this.idPedido,
      nomeCliente: this.pedido?.nomeCliente,
      emailCliente: this.pedido?.emailCliente,
      pago: this.pedido?.pago,
      itensPedido: this.itensPedido
    }

    this.pedidosService.updatePedido(this.idPedido, form)
     .subscribe(
      response => {
        console.log(response);
        this.styleAlert = 'alert alert-succes';
        this.mostrarMesagem('Pedido alterado com sucesso!');
        this.getPedido();
      },
      error => {
        console.log(error);
        this.styleAlert = 'alert alert-error';
        this.mostrarMesagem('Ocorreu um erro ao alterar o pedido!');
      });

  }

  excluirPedido(id: any)
  {
    this.pedidosService.deletePedido(id)
    .subscribe(
     response => {
       console.log(response);
       this.styleAlert = 'alert alert-success';
       this.mostrarMesagem('Pedido excluido com sucesso!');
       this.pedido = null;
     },
     error => {
       console.log(error);
       this.styleAlert = 'alert alert-error';
       this.mostrarMesagem('Ocorreu um erro ao excluir o pedido!');
     });

  }

  mostrarMesagem(msg = '', styleAlert='alert alert-primary')
  {
    this.styleAlert = styleAlert;
    this.mostrarAlert = true;
    this.msgAlert = msg;
  }

  salvarQuantidade()
  {

    if(this.quantidade == 0)
    {
      this.mostrarMesagem('Favor informe um valor maior que 0 ou exclua o pedido');
      this.closePopupQuantidade();
    }else{

      let item = {
        id: this.idItemPedido,
        idPedido: this.idPedido,
        idProduto: this.idProduto,
        quantidade: this.quantidade
     }
     this.itensPedido.push(item);
     this.mostrarMesagem('Quantidade atualizada');
     this.closePopupQuantidade();
     this.alterarPedido();
    }


  }

  closePopupQuantidade()
    {
      this.idProduto = 0,
      this.quantidade = 0;
      this.displayQuantidade = "none";
  }

  openModalQuantidade(id: any, idProduto: any, nomeProduto: any, quantidade: any)
  {
    console.log(idProduto, nomeProduto)
    this.idItemPedido = id;
    this.idProduto = idProduto;
    this.nomeProduto = nomeProduto;
    this.quantidade = quantidade;
    this.displayQuantidade = "block";
  }
  voltar()
  {
    history.back();
  }

}
