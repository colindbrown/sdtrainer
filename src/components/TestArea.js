import React from 'react';
import List from './List';

class TestArea extends React.Component {
    render() {
        return (
            <div className="row">
                <List size="col-md-6" />
                <List size="col-md-6" />
            </div>
        )
    }
}

export default TestArea;