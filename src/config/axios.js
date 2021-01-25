import axios from "axios";
import { apiUrl } from "../utils/static_vars";

const URL = apiUrl;

export default axios.create({
  baseURL: URL,
});
