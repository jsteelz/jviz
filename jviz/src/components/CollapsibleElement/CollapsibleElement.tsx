import React from 'react';
import './CollapsibleElement.css';

interface CollapsibleElementProps {
  title: string;
  content: any;
}

interface CollapsibleElementState {
  isExpanded: boolean;
}

class CollapsibleElement extends React.Component<CollapsibleElementProps, CollapsibleElementState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

  handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  renderTitle() {
    return (
      <div className="title" onClick={this.handleClick}>
        {this.props.title}
      </div>
    );
  }

  renderContent() {
    return (
      <div className="collapsible-content">
        {this.props.content}
      </div>
    );
  }

  render() {
    return (
      <div className="collapsible-element">
        {this.renderTitle()}
        {this.state.isExpanded && this.renderContent()}
      </div>
    );
  }
}

export default CollapsibleElement;
