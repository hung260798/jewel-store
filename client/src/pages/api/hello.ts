// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { API_URL } from "@/constants/URLS";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await fetch(`${API_URL}/products`, { method: "get" });
  const results = await response.json();
  // console.log("results", results);
  res.status(200).json({ name: results });
}
