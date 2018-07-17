import React from "react";

class CreateFunctionBar extends React.Component {

    state = {
        newTemplateName: ""
    }

    handleChange = (e) => {
        this.setState({ newTemplateName: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const result = this.props.saveNewTemplate(this.state.newTemplateName);
        if (result) {
            this.setState({ newTemplateName: "" });
        };
    }

    handleRemove = (e) => {
        e.preventDefault();
        this.props.removeAll();
    }


    render() {
        const templateListItems = this.props.templateNames.map((name) =>
            <button className="dropdown-item" key={name} onClick={() => this.props.addTemplate(name)}>{name}</button>
        );

        const disableTemplateMenu = (this.props.templateNames.length > 0) ? "" : "disabled";

        return (
            <nav className="navbar navbar-light navbar-expand-sm bg-light">

                <div className="navbar-nav mr-auto ml-2">
                    <div className="dropdown mr-2">
                        <button className={`${disableTemplateMenu} btn btn-secondary dropdown-toggle`} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Add template
                        </button>
                        <div className="dropdown-menu">
                            {templateListItems}
                        </div>
                    </div>
                    <button className="btn btn-secondary" href="#" onClick={this.handleRemove}>Remove all</button>
                </div>
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <input className="form-control mr-sm-2" placeholder="Name Template" value={this.state.newTemplateName} onChange={this.handleChange} />
                    <button className="btn btn-info my-2 my-sm-0" type="submit">Save Template</button>
                </form>

            </nav>
        )
    }

}

export default CreateFunctionBar;