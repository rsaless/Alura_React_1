import React, {Component} from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from './components/InputCustomizado';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor(props){
        super(props);
        this.state = {
          titulo:'',
          preco:'',
          autorId:''
        };
    }

    componentDidMount(){
        $.ajax({
            url:'http://localhost:8080/api/autores',
            dataType: 'json',
            sucess: (resposta) => {
                this.setState = ({autores:resposta});
            }
        });
    }

    enviaForm = (evento) => {
        evento.preventDefault();
        var titulo = this.state.titulo.trim();
        var preco = this.state.preco.trim();
        var autorId = this.state.autorId;

        $.ajax({
            url:'http://localhost:8080/api/livros',
            contentType: 'application/json',
            dataType:'json',
            type:'post',
            data: JSON.stringify({titulo:titulo,preco:preco,autorId:autorId}),
            success: (novaLista) => {
                console.log("enviado com sucesso");
                PubSub.publish("atualiza-lista-livros",novaLista);
                this.setState({titulo: '', preco: '', autorId:''});
            },
            error: (resposta) => {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: () => {
                PubSub.publish("limpa-erros",{});
            }
        });
        this.setState({titulo: '', preco: '', autorId: ''});
    }

    setTitulo = (evento) => this.setState({titulo: evento.target.value});
    setPreco = (evento) => this.setState({preco: evento.target.value});
    setAutorId = (evento) => this.setState({autorId: evento.target.value});

    render(){
        var autores = this.props.autores.map( autor => <option key={autor.id} value={autor.id}>{autor.nome}</option>);
        return(
            
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputCustomizado id="titulo" type="text" name="titulo" label="titulo" value={this.state.titulo} onChange={this.setTitulo}/>
                    <InputCustomizado id="preco" type="number" name="preco" label="Preço" value={this.state.preco} onChange={this.setPreco}/>
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label> 
                        <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.setAutorId}>
                            <option value="">Selecione</option>
                            {autores}
                        </select>
                        <span className="error">{this.state.msgErro}</span>
                    </div>
                    
                    <BotaoSubmitCustomizado label="Gravar"/>
                </form>             
            </div> 
        );
    }
}

class TabelaLivros extends Component {

    render(){
        
        return(
            <div>            
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.lista.map(livro => {
                            return (
                                <tr key={livro.titulo}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table> 
            </div> 
        );
    }
}

export default class LivroBox extends Component {

    constructor(props){
        super(props);
        this.state = {lista: [], autores: []};
    }
    
    componentDidMount(){
        $.ajax({
            url: "http://localhost:8080/api/livros",
            dataType: 'json',
            success: data => this.setState({lista: data})
          });
      
          $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: 'json',
            success: data => this.setState({autores: data})
          });

        PubSub.subscribe("atualiza-lista-livros", (topico, novaLista) => {
            this.setState({lista:novaLista});
        });
    }

    render(){
        return(
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">                            
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>       
                </div>      

            </div>
        );
    }
}