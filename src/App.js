import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './components/InputCustomizado';
import BotaoSubmitCustomizado from './components/BotaoSubmitCustomizado';
import './css/pure-min.css';
import './css/side-menu.css';

class App extends Component {

  constructor(){
    super();
    this.state = { 
      lista: [],
      nome:'',
      email:'',
      senha:''
    };
  }

  componentWillMount(){
    $.ajax({
      url:"http://localhost:8080/api/autores",
      dataType: 'json',
      success: (resposta) => this.setState({lista:resposta})
    });
  }

  componentDidMount(){
    
  }

  enviaForm = (evento) => {
    evento.preventDefault();
    $.ajax({
      url:'http://localhost:8080/api/autores',
      contentType: 'application/json',
      dataType:'json',
      type:'post',
      data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
      success: (resposta) => {
        console.log("enviado com sucesso");
        this.setState({lista: resposta, nome: '', email: '', senha:''});
      },
      error: (resposta) => {console.log("erro");}
    });
  }

  setNome = (evento) => this.setState({nome: evento.target.value});
  setEmail = (evento) => this.setState({email: evento.target.value});
  setSenha = (evento) => this.setState({senha: evento.target.value});

  render(){
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link"><span></span></a>
        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="#">Company</a>
            <ul className="pure-menu-list">
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
              <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livros</a></li>
            </ul>
          </div>
        </div>
        <div id="main">
          <div className="header">
            <h1>Cadastro de autores</h1>
            <div className="content" id="content">
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                  <InputCustomizado id="nome" type="text" name="nome" label="Nome" value={this.state.nome} onChange={this.setNome}/>
                  <InputCustomizado id="email" type="email" name="email" label="Email" value={this.state.email} onChange={this.setEmail}/>
                  <InputCustomizado id="senha" type="password" name="senha" label="Senha" value={this.state.senha} onChange={this.setSenha}/>
                  <BotaoSubmitCustomizado label="Gravar"/>
                </form>             

              </div>  
              <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.lista.map(autor => {
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
