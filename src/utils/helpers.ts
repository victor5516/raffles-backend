const calculatePercentage = (total: number, sold: number) => {
  return (sold / total) * 100;
};

export { calculatePercentage };