import React from "react";

class Alerts extends React.Component {

    render() {
        const alerts = this.props.alerts.map((alert) =>
            <div className={`alert ${alert.type} m-2`} role="alert" key={alert.text}>
                <span className="mr-auto">
                    {alert.text}
                </span>
                <button type="button" className="close" aria-label="Close" onClick={this.props.clearAlerts}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
        return (
            <div>
                {alerts}
            </div>
        )
    }
}

const AlertsContext = React.createContext({
    showAlert: (type, text) => console.log(`${type} alert: ${text}`),
    clearAlerts: () => console.log("clear alerts")
});

export {AlertsContext};
export default Alerts;