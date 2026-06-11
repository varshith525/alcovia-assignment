import axios from "axios";

export const syncOperations = async (
  operations: any[]
) => {
  const res = await axios.post(
    "http://localhost:3001/sync",
    { operations }
  );

  return res.data;
};