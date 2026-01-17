export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};

export const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime());
};
