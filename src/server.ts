import { Server } from "http";
import app from "./app";

(async () => {
  const server: Server = app.listen(5000, () => {
    console.log("Sever is running on port ", 5000);
  });
})();
