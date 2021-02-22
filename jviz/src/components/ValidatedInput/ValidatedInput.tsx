import React from 'react';
import './ValidatedInput.css';
import Button from '../Button/Button';

interface ValidatedInputProps {
  title: string;
  validateInput(input: string): boolean;
  invalidMessage: string;
  onEnterData(input: string): void;
  placeholder: string;
}

interface ValidatedInputState {
  currentValue: string;
  isValid: boolean;
  selectedValue: string;
}

class ValidatedInput extends React.Component<ValidatedInputProps, ValidatedInputState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentValue: '',
      isValid: true,
      selectedValue: '',
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    this.setState({
      currentValue: e.target.value,
    });
  }

  handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') this.validate();
  }

  handleSelectedClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    this.setState({
      selectedValue: '',
      currentValue: '',
      isValid: true,
    });
  }

  validate = () => {
    const value = this.state.currentValue.trim();
    if (this.props.validateInput(value)) {
      this.props.onEnterData(value);
      this.setState({
        isValid: true,
        selectedValue: value,
      });
    } else if (value === '') {
      this.props.onEnterData(value);
      this.setState({
        isValid: true,
        currentValue: '',
      });
    } else {
      this.setState({
        isValid: false,
      });
    }
  }

  renderButton = () => {
    return <Button buttonText="enter" whenClicked={this.validate}/>;
  }

  renderInput = () => {
    return (
      <input
        className="validatedinput"
        type="text"
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        placeholder={this.props.placeholder}
      />
    );
  }

  renderSelectedValue = () => {
    return (
      <div 
        className="selectedvalue"
        onClick={this.handleSelectedClick}
      >
        {this.state.selectedValue}
      </div>
    );
  }

  renderInvalid = () => {
    return (
      <div className="invalid">
        invalid input
      </div>
    )
  }

  render() {
    return (
      <div className="validatedinputparent">
        <div className="validatedinputtitle">
          {this.props.title}
        </div>
        {this.state.selectedValue ? this.renderSelectedValue() : this.renderInput()}
        {this.state.selectedValue ? null : this.renderButton()}
        {this.state.isValid ? null : this.renderInvalid()}
      </div>
    );
  }
}

export default ValidatedInput;
