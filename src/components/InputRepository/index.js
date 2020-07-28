import React from "react";
import { Form, Input, Checkbox } from "antd";
import Select from "./Select";
import Upload from "./Upload";
import DatePicker from "./DatePicker";
import CheckboxGroup from "./CheckboxGroup";
import SliderForm from "./Slider";

const InputRepository = props => {
  const {element, form} = props;

  const onChange = value => {
		form.setFieldsValue({
			[element.name] : value
		})
	}

  const pickInput = () => {
    switch (element.component) {
      case "Input":
        return <Input />;
      case "Input.Password":
        return <Input.Password />;
      case "Input.Number":
        return <Input.Number />;
      case "Input.TextArea":
        return <Input.TextArea />;
      case "Checkbox":
        // revisar, no retorna valor
        return <Checkbox />;
      case "CheckboxGroup":
        // revisar, no retorna valor
        return CheckboxGroup({ ...props, all: true });
      case "DatePicker":
        return DatePicker(props);
      case "Select":
        return Select(element);
      case "Upload":
        return <Upload />;
      case "slider":
        return <SliderForm onChange={onChange} {...props} key={element.label} />
      default:
        return <Input />;
    }
  };

  switch (element.component) {
    case "label":
      return <label className="label" key={element.label}>{element.label}</label>;
    case "h2":
      return <h2 className="h2" key={element.label}>{element.label}</h2>;
    case "link":
      return (
        <a key={element.label} href={element.href} rel="noopener noreferrer">
          {element.label}
        </a>
      );
    default:
      return (
        <Form.Item
          key={element.label}
          label={element.label}
          name={element.name}
          dependencies={element.dependencies}
          hasFeedback={element.hasFeedback}
          valuePropName={element.valuePropName}
          className={element.component}
          rules={
            element.validate
              ? [
                  {
                    required: element.required,
                    message: `Porfavor, ingrese ${element.label}`,
                  },
                  element.validate,
                ]
              : [
                  {
                    required: element.required,
                    message: `Porfavor, ingrese ${element.label}`,
                  },
                ]
          }
        >
          {pickInput()}
        </Form.Item>
      );
  }
};

export default InputRepository
