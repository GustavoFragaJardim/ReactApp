import React, { Component } from 'react';
import PubSub from 'pubsub-js'

export default class CustomizedInput extends Component {

    constructor() {
        super();
        this.state = { msgError: '' }
    }

    render() {
        return (
            < div className="pure-control-group" >
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input {...this.props} />
                <span className='error'>{this.state.msgError}</span>
            </div >
        )
    }
    componentDidMount() {


        PubSub.subscribe('removeAtributes', function (step) {
            this.setState({ msgError: '' })

        }.bind(this));

        PubSub.subscribe('validatorError', function (step, error) {
            if (error.field === this.props.name) {
                this.setState({ msgError: error.defaultMessage })
            }
        }.bind(this));
    }
}