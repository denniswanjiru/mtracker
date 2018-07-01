export class Component {
  constructor(props) {
    this.props = props;
    this.setState = this.setState.bind(this);
  }

  setState(newState) {
    return Object.assign(this.state, newState);
  }
}
