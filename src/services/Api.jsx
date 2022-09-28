import axios from "axios";

export default axios.create({ baseURL: `http://stock.agsistemas.net.ar:3001/api/` });