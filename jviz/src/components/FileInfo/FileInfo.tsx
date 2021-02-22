import React from 'react';
import './FileInfo.css';
import getJsonData from '../common/getJsonData';

interface FileInfoProps {
  requestUrl: string;
  fieldsToExclude: string[];
}

interface FileInfoState {
  fileInfo: { [index: string]: string };
  isExpanded: boolean;
}

class FileInfo extends React.Component<FileInfoProps, FileInfoState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isExpanded: false,
      fileInfo: {},
    };
  }

  async componentDidMount() {
    const fileInfo = await getJsonData(this.props.requestUrl);

    this.setState({
      fileInfo: fileInfo,
    });
  }

  renderInfo() {
    return Object.keys(this.state.fileInfo).map((fileProp) => {
      if (!this.props.fieldsToExclude.includes(fileProp))
        return (
          <div className="feedprop" key={`${fileProp}-${this.state.fileInfo[fileProp]}-feedprop`}>
            <div className="prop" key={`${fileProp}-${this.state.fileInfo[fileProp]}-prop`}>{fileProp}</div>
            {this.state.fileInfo[fileProp]}
          </div>
        );
      else return null;
    });
  }

  render() {
    return (
      <div>
        {this.renderInfo()}
      </div>
    )
  }
}

export default FileInfo;
