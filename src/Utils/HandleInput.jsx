export const handleChangeInput = (name, setValue, value) => {
  setValue((prev) => {
    return {
      ...prev,
      [name]: value,
    };
  });
};

export const handleInputValidation = (e, setData) => {
  const { value, name } = e.target;
  console.log(value, name);
  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};
