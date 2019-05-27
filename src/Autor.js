import React, {Component} from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado from './components/InputCustomizado';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor(){
        super();
        this.state = {
          nome:'',
          email:'',
          senha:''
        };
    }

    enviaForm = (evento) => {
        evento.preventDefault();
        $.ajax({
            url:'http://localhost:8080/api/autores',
            contentType: 'application/json',
            dataType:'json',
            type:'post',
            data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
            success: (novaLista) => {
                console.log("enviado com sucesso");
                PubSub.publish("atualiza-lista-autores",novaLista);
                this.setState({nome: '', email: '', senha:''});
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
    }
    
    setNome = (evento) => this.setState({nome: evento.target.value});
    setEmail = (evento) => this.setState({email: evento.target.value});
    setSenha = (evento) => this.setState({senha: evento.target.value});
    

    render(){
        return(
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                  <InputCustomizado id="nome" type="text" name="nome" label="Nome" value={this.state.nome} onChange={this.setNome}/>
                  <InputCustomizado id="email" type="email" name="email" label="Email" value={this.state.email} onChange={this.setEmail}/>
                  <InputCustomizado id="senha" type="password" name="senha" label="Senha" value={this.state.senha} onChange={this.setSenha}/>
                  <BotaoSubmitCustomizado label="Gravar"/>
                </form>             
            </div> 
        );
    }
}

class TabelaAutores extends Component {

    render(){
        return(
            <div>            
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.lista.map(autor => {
                            return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>
                                    <td>{autor.email}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table> 
            </div> 
        );
    }
}

export default class AutorBox extends Component {

    constructor(){
        super();
        this.state = {lista: []};
    }
    
    componentDidMount(){
        $.ajax({
          url:"http://localhost:8080/api/autores",
          dataType: 'json',
          success: (resposta) => this.setState({lista:resposta})
        });

        PubSub.subscribe("atualiza-lista-autores", (topico, novaLista) => {
            this.setState({lista:novaLista});
        });
    }

    render(){
        return(
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">                            
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>        
                </div>      

            </div>
        );
    }
}