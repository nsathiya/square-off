import * as React from 'react';

type valuesType = { [id: string]: {} };

export default class SquareForm extends React.Component<{
  onSubmit: (values: {}) => void;
  fieldNames: any;
}, { values: {} }> {
  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      values: {},
    };
  }

  handleChange(event: React.FormEvent<HTMLInputElement>, name: string, value: any) {
    let valueToSave: any, nameToSave: string;
    if (value && name) {
      valueToSave = value;
      nameToSave = name;
    } else {
      const target = event.currentTarget;
      valueToSave = target.type === 'number' ? parseInt(target.value, 10) : target.value;
      nameToSave = target.name;
    }
    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [nameToSave]: valueToSave
      }
    }));
  }

  handleSubmit(event: any) {
    event.preventDefault();
    // Get default value if already set
    const formData = {} as any;
    this.props.fieldNames.forEach((field: string) => {
      const htmlField = document.getElementById(field) as any;
      const changedValue = (this.state.values as valuesType)[field];
      formData[field] = changedValue
                        || (htmlField && htmlField.value)
                        || undefined;
    });
    this.props.onSubmit(formData);
  }

  render() {
    // pass state and callbacks to child as parameters
    const childrenProps: any = this.props.children || {};
    return React.cloneElement(this.props.children as React.ReactElement<any>, {
      state: this.state,
      handleChange: this.handleChange,
      handleSubmit: this.handleSubmit,
      ...childrenProps.props
    });
  }
}
