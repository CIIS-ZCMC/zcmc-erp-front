function handleInputValidation(e, setData, setError) {
  const { value, name } = e.target;

  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
}

export default handleInputValidation;
