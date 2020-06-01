import { drawGame } from "./view";
export const controller = model => {
  model.subscribe(drawGame);
  document.getElementById("start").addEventListener("click", () => {
    model.run();
  });
  document.getElementById("reset").addEventListener("click", () => {
    model.reset();
  });
  document.getElementById("stop").addEventListener("click", () => {
    model.stop();
  });
};
