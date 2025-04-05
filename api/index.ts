import { ResponseData } from "@/types/api";
import axios, { AxiosResponse } from "axios";

const API_KEY = "49657370-185a6d44e2c32ea4de33f1208";

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params?: Record<string, string | number>): string => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";
  if (!params) return url;

  let paramKeys = Object.keys(params);
  paramKeys.map((key) => {
    let value =
      key === "q" ? encodeURIComponent(params[key]).toString() : params[key];
    url += `&${key}=${value}`;
  });
  console.log("final url", url);
  return url;
};

export const apiCall = async (
  params: Record<string, string | number>
): Promise<AxiosResponse<ResponseData, ResponseData>> => {
  try {
    const response = await axios.get(formatUrl(params));
    return response;
  } catch (error: any) {
    console.log("got error", error.message);
    throw error;
  }
};
