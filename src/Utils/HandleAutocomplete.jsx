function handleSingleChangeAutcomplete(value, setData, name) {
  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
}

export default handleSingleChangeAutcomplete;
