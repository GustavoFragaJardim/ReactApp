
import React, { Component } from 'react';
import $ from 'jquery';
import CustomizedInput from './component/customizedInput';
import PubSub from 'pubsub-js'
import ErrorManager from './ErrorManager'

class BookForm extends Component {

    constructor() {
        super();
        this.state = { title: '', price: '', author: '' };
        this.setPrice = this.setPrice.bind(this)
        this.setTitle = this.setTitle.bind(this)
        this.setAuthor = this.setAuthor.bind(this)
        this.sendForm = this.sendForm.bind(this)

    }
    sendForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            datatype: 'json',
            type: 'post',
            data: JSON.stringify({
                titulo: this.state.title,
                preco: this.state.price,
                autorId: this.state.author
            }),
            success: function (res) {
                PubSub.publish('updateBookList', res)
                this.setState({ title: '', price: '', author: '' })
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

    setTitle(evento) {
        this.setState({ title: evento.target.value })
    }
    setAuthor(evento) {
        this.setState({ author: evento.target.value })
    }
    setPrice(evento) {
        this.setState({ price: evento.target.value })
    }
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form onSubmit={this.sendForm} method='post' className="pure-form pure-form-aligned">
                    <CustomizedInput label='Título' id='titulo' type='text' name='titulo' value={this.state.title} onChange={this.setTitle} />
                    <CustomizedInput label='Preço' id='preco' type='number' name='preco' value={this.state.price} onChange={this.setPrice} />
                    < div className="pure-control-group" >
                        <label htmlFor="authorId">Autor</label>
                        <select name='autorId' id="authorId" onChange={this.setAuthor}>
                            <option value=''>Selecione um autor</option>
                            {
                                this.props.authors.map(function (authors) {
                                    return (<option key={authors.id} value={authors.id}>{authors.nome} </option>)
                                })
                            }
                        </select>
                        <span className='error'>{this.state.msgError}</span>
                    </div >
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>
        )
    }
}

class BookTable extends Component {
    render() {
        return (
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
                        {
                            this.props.lista.map(function (book) {
                                return (
                                    <tr key={book.id}>
                                        <td> {book.titulo}</td>
                                        <td> {book.preco}</td>
                                        <td> {book.autor.nome}</td>
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

export default class BookBox extends Component {

    constructor() {
        super();
        this.state = { lista: [], authors: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            datatype: 'json',
            success: function (res) {
                this.setState({ lista: res });
            }.bind(this)
        });
        PubSub.subscribe('updateBookList', function (step, newList) {
            this.setState({ lista: newList })

        }.bind(this)
        )
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            datatype: 'json',
            success: function (res) {
                this.setState({ authors: res });
            }.bind(this)
        });
        PubSub.subscribe('updateBookList', function (step, newList) {
            this.setState({ authors: newList })

        }.bind(this)
        )
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Criar Livros</h1>
                </div>
                <div>
                    <BookForm authors={this.state.authors} />
                    <BookTable lista={this.state.lista} />
                </div>
            </div>
        );
    }

}