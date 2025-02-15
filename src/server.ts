import app from "./app";
import seedAdmin from "./app/DB";

(async () => {
  try {
    app.listen(5000, () => {
      console.log("Sever is running on port ", 5000);
    });

    seedAdmin();
  } catch (err) {
    console.log(err);
  }
})();
