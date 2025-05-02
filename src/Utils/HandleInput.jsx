export const handleChangeInput = (name, setValue, value) => {
  setValue((prev) => {
    return {
      ...prev,
      [name]: value,
    };
  });
};
