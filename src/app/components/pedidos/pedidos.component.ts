import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  public displayStyle = "none";
  public displayQuantidade = "none";
  public produtos: any[] = [];
  public styleAlert = "alert alert-primary";

  public itensPedido: any[]=[];
  public nomeProduto: string='';
  public quantidade  = 0;
  public idProduto = 0;
  public mostrarAlert = false;
  public msgAlert = '';
  public form: FormGroup;
  public pedido: any;
  public pedidos: any[] = [];

  constructor(private pedidosService: PedidosService,
    private fb: FormBuilder,private router: Router) {

      this.form =  this.fb.group({
        nomeCliente: ['', Validators.required],
        emailCliente: ['', [Validators.email, Validators.required]],
        pago: ['false']
      });
    }

  ngOnInit(): void {
    this.getProdutos();
    this.getPedidos();
  }

  getProdutos()
  {
    this.pedidosService.getProductsAll()
    .subscribe(
      response => {
        // console.log(response);
        this.produtos = response;
      },
      error => {
        console.log(error);
      });

  }

  salvar()
  {
    // console.log(this.itensPedido.length);
    if(this.itensPedido.length == 0)
    {
      this.styleAlert = 'alert alert-warning';
      this.mostrarMesagem('Favor informar um pedido!');
      this.closePopup();
    } else{
      // console.log(this.form.value);
      if(this.form.value.pago === null)
        this.form.patchValue({pago: false})
      let form = this.form.value;
      form.itensPedido = this.itensPedido;
      // console.log(this.form.value);

    this.pedidosService.createPedido(form)
     .subscribe(
      response => {
        // console.log(response);
        this.styleAlert = 'alert alert-succes';
        this.mostrarMesagem('Pedido realizado com sucesso!');
        this.router.navigate(['/', 'visualizar',response?.itensPedidos[0]?.idPedido]);
      },
      error => {
        console.log(error);
        this.styleAlert = 'alert alert-error';
        this.mostrarMesagem('Ocorreu um erro ao realizar o pedido!');
        this.closePopup();
      });
    }
  }

  getById()
  {
    this.pedidosService.getPedido(1)
     .subscribe(
      response => {
       this.pedido =  response;
      },
      error => {
        console.log(error);
        this.styleAlert = 'alert alert-error';
        this.mostrarMesagem('Ocorreu um erro ao recuperar o pedido!');
      });
  }

  getPedidos() {
    this.pedidosService.getPedidoAll()
     .subscribe(
      response => {
       this.pedidos =  response;
      //  console.log(this.pedidos);
      },
      error => {
        console.log(error);
        this.styleAlert = 'alert alert-error';
        this.mostrarMesagem('Ocorreu um erro ao recuperar o pedido!');
      });
  }

  openModal()
  {
    this.form.reset();
    this.displayStyle = "block";
  }

  openModalQuantidade(id: any, nomeProduto: string)
  {
    this.idProduto = id;
    this.nomeProduto = nomeProduto;
    this.displayQuantidade = "block";
  }

  closePopup()
  {
    this.displayStyle = "none";
  }

  closePopupQuantidade()
  {
    this.idProduto = 0,
    this.quantidade = 0;
    this.displayQuantidade = "none";
  }

  salvarQuantidade()
  {

    if(this.quantidade == 0)
    {
      this.mostrarMesagem('Favor informe um valor maior que 0');
      this.closePopupQuantidade();
    }else{

      let item = {
        idPedido: 0,
        idProduto: this.idProduto,
        quantidade: this.quantidade
     }
     this.itensPedido.push(item);
     this.mostrarMesagem('Quantidade atualizada');
     this.closePopupQuantidade();
    }

  }

  mostrarMesagem(msg = '', styleAlert='alert alert-primary')
  {
    this.styleAlert = styleAlert;
    this.mostrarAlert = true;
    this.msgAlert = msg;
  }

  visualizar(id: any){
    this.router.navigate(['/', 'visualizar', id]);
  }

}
