import React, { useState, useEffect } from "react";
import { Slider } from "antd";

const SliderForm = (props) => {
  const [defaultValue, setDefaultValue] = useState([18, 100]);
  useEffect(() => {
    setDefaultValue(
      props.value ? [parseInt(props.value[0]), parseInt(props.value[1])] : null
    );
  }, [props.value]);
  const onChange = (value) => {
    setDefaultValue(value);
  };

  return (
    <>
      <Slider
        range
        step={2}
        min={18}
        max={100}
        marks={{
          18: "18 años",
        }}
        defaultValue={defaultValue}
        value={defaultValue}
        onChange={onChange}
        onAfterChange={props.onChange}
      />
    </>
  );
};

export default SliderForm;
