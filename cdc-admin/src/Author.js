
import React, { Component } from 'react';
import $ from 'jquery';
import CustomizedInput from './component/customizedInput';
import PubSub from 'pubsub-js'
import ErrorManager from './ErrorManager'

class AuthorForm extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.setEmail = this.setEmail.bind(this)
        this.setNome = this.setNome.bind(this)
        this.setSenha = this.setSenha.bind(this)
        this.sendForm = this.sendForm.bind(this)

    }
    sendForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            contentType: 'application/json',
            datatype: 'json',
            type: 'post',
            data: JSON.stringify({
                nome: this.state.nome,
                email: this.state.email,
                senha: this.state.senha
            }),
            success: function (res) {
                PubSub.publish('updateAuthorList', res)
                this.setState({ nome: '', email: '', senha: '' })
            }.bind(this),
            error: function (err) {
                if (err.status === 400) {
                    new ErrorManager().publishErrors(err.responseJSON);
                }
            },
            beforeSend: function () {
                PubSub.publish('removeAtributes', {})
            }
        });
    }

    setNome(evento) {
        this.setState({ nome: evento.target.value })
    }
    setSenha(evento) {
        this.setState({ senha: evento.target.value })
    }
    setEmail(evento) {
        this.setState({ email: evento.target.value })
    }
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form onSubmit={this.sendForm} method='post' className="pure-form pure-form-aligned">
                    <CustomizedInput label='nome' id='nome' type='text' name='nome' value={this.state.nome} onChange={this.setNome} />
                    <CustomizedInput label='email' id='email' type='email' name='email' value={this.state.email} onChange={this.setEmail} />
                    <CustomizedInput label='senha' id='senha' type='password' name='senha' value={this.state.senha} onChange={this.setSenha} />
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        )
    }
}

class AuthorTable extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(function (autor) {
                                return (
                                    <tr key={autor.id}>
                                        <td> {autor.nome}</td>
                                        <td> {autor.email}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default class AuthorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            datatype: 'json',
            success: function (res) {
                this.setState({ lista: res });
            }.bind(this)
        });
        PubSub.subscribe('updateAuthorList', function (step, newList) {
            this.setState({ lista: newList })

        }.bind(this)
        )
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Criar Autores</h1>
                </div>
                <div>
                    <AuthorForm />
                    <AuthorTable lista={this.state.lista} />
                </div>
            </div>
        );
    }

}