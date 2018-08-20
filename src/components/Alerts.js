import React from "react";

class Alerts extends React.Component {

    render() {
        const alert = this.props.alert;
        return (
            <div className={`alert ${alert.type} m-2 ${this.props.modal ? "" : "alerts-bar"}`} role="alert" key={alert.text}>
                <span className="mr-auto">
                    {alert.text}
                </span>
                <button type="button" className="close" aria-label="Close" onClick={this.props.clearAlert}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        )
    }
}

const AlertsContext = React.createContext({
    showAlert: (type, text) => console.log(`${type} alert: ${text}`),
    clearAlert: () => console.log("clear alert")
});

export {AlertsContext};
export default Alerts;