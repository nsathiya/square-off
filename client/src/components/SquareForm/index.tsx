import * as React from 'react';

export default class SquareForm extends React.Component<{ onSubmit: (values: {}) => void; }, { values: {} }> {
  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      values: {},
    };
  }

  handleChange(event: React.FormEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const value = target.value;
    const name = target.name;
    
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [name]: value
      }
    }));
  }

  handleSubmit(event: React.FormEvent<EventTarget>) {
    event.preventDefault();
    // add validation here
    // set `isSubmitting` to true here as well
    this.props.onSubmit(this.state.values);
  }

  render() {
    // pass state and callbacks to child as parameters
    return React.cloneElement(this.props.children as React.ReactElement<any>, {
      state: this.state,
      handleChange: this.handleChange,
      handleSubmit: this.handleSubmit
    });
  }
}
