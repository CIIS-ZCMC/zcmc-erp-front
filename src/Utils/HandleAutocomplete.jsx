function handleSingleChangeAutcomplete(
  value,
  setData,
  name,
  setError,
  handleError = true
) {
  console.log(value);
  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
  if (handleError) {
    const hasError = value === "" || value === undefined;
    setError(name, hasError);
  }
}

export default handleSingleChangeAutcomplete;
