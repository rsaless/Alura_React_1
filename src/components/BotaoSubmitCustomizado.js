import React from 'react';

class BotaoSubmitCustomizado extends React.Component {
    render() {
        return (
            <div className="pure-control-group">
                <label></label>
                <input type="submit" className="pure-button pure-button-primary" value={this.props.label} />
            </div>
        ); 
    }
}

export default BotaoSubmitCustomizado