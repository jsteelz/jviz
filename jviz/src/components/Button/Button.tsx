import React from 'react';
import './Button.css';

interface ButtonProps {
  buttonText: string;
  whenClicked(): void;
}

class Button extends React.PureComponent<ButtonProps> {
  handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    this.props.whenClicked();
  }

  render() {
    return (
      <button className="button" onClick={this.handleClick}>
        {this.props.buttonText}
      </button>
    );
  }
}

export default Button;