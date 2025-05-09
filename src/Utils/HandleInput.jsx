function handleInputValidation(e, setData, setError) {
  const { value, name } = e.target;
  console.log(value, name);
  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
}

export default handleInputValidation;
