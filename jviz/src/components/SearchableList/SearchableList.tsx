import React from 'react';
import './SearchableList.css';

interface ListElement {
  id: string;
  listKey: string;
  listValue: string;
}

interface ListProps {
  title: string;
  listElements: ListElement[];
  onElementClicked(id: string): void;
}
  
interface ListState {
  filteredElements: undefined | ListElement[];
  selectedElement: undefined | ListElement;
}

class SearchableList extends React.Component<ListProps, ListState> {
  constructor(props: any) {
    super(props);

    this.state = {
      filteredElements: undefined,
      selectedElement: undefined,
    };
  }

  getElementById = (id: string) => {
    for (const element of this.props.listElements) {
      if (element.id === id) return element;
    }
  }

  handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    this.setState({
      selectedElement: this.getElementById(id),
    });

    this.props.onElementClicked(id);
  }

  filter = (searchValue: string) => {
    const results = [];
    const regExp = new RegExp(searchValue.trim(), 'i');
    for (const element of this.props.listElements) {
      if (regExp.test(element.listKey) || regExp.test(element.listValue)) results.push(element);
    }
    return results;
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      this.setState({
        filteredElements: this.filter(e.target.value),
      });
    } else {
      this.setState({
        filteredElements: this.props.listElements.slice(),
      });
    }
  }

  resetList() {
    this.setState({
      filteredElements: this.props.listElements.slice(),
      selectedElement: undefined,
    });

    this.props.onElementClicked('');
  }

  renderListElement(element: ListElement) {
    return (
      <div
        className="listElement"
        key={element.id}
        onClick={(e: React.MouseEvent) => this.handleClick(e, element.id)}
      >
        <span className="listkey">{element.listKey}</span>{element.listValue}
      </div>
    );
  }

  renderSearch() {
    return (
      <input
        className="routefilter"
        type="text"
        onChange={this.onInputChange}
        placeholder={`🔎  filter ${this.props.title}...`}
      />
    );
  }

  renderList() {
    const listToRender = this.state.filteredElements ? this.state.filteredElements : this.props.listElements;
    return (    
      listToRender.map((element) => {
        return this.renderListElement(element);
      })
    )
  }

  renderSelectedElement(e: ListElement) {
    return (
      <div className="selectedElement">
        <span
          className="backbutton"
          onClick={() => this.resetList()}
        >←
        </span>
        {this.props.title} <span className="listkey">{e.listKey ? e.listKey : e.listValue}</span>
      </div>
    )
  }

  render() {
    if (this.state.selectedElement === undefined) {
      return (
        <div className="searchablelistparent">
          <div className="listtitle">
            {this.props.title}
          </div>
          <div className="searchablelist">
            {this.renderSearch()}
            {this.renderList()}
          </div>
        </div>
      );
    }
    return (
      <div className="searchablelistparent">
        <div className="listtitle">
          {this.props.title}
        </div>
        <div className="searchablelist">
          {this.renderSelectedElement(this.state.selectedElement)}
        </div>
        </div>
    )
  }
}

export default SearchableList;
