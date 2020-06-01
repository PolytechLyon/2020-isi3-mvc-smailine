import {
  GAME_SIZE,
  CELL_STATES,
  DEFAULT_ALIVE_PAIRS,
  RENDER_INTERVAL
} from "./constants";

export class Model {
  constructor() {
    this.width = GAME_SIZE;
    this.height = GAME_SIZE;
    this.raf = null;
    this.listeObserver = [];
  }

  init() {
    this.state = Array.from(new Array(this.height), () =>
      Array.from(new Array(this.width), () => CELL_STATES.NONE)
    );
    DEFAULT_ALIVE_PAIRS.forEach(([x, y]) => {
      this.state[y][x] = CELL_STATES.ALIVE;
    });
    this.updated();
  }

  run(date = new Date().getTime()) {
    this.raf = requestAnimationFrame(() => {
      const currentTime = new Date().getTime();
      if (currentTime - date > RENDER_INTERVAL) {
        const cellAchanger = Array.from(this.height * this.width);
        let index = 0;
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.width; j++) {
            const nbAlive = this.aliveNeighbours(i, j);
            // TODO implement Game of life
            //Le cas où la cellule est morte
            if (!this.isCellAlive(i, j)) {
              if (nbAlive === 3) {
                cellAchanger[index] = [j, i, CELL_STATES.ALIVE];
                index++;
              }
            } else {
              //le cas où la cellule est vivante
              if (nbAlive < 2 || nbAlive > 3) {
                cellAchanger[index] = [j, i, CELL_STATES.DEAD];
                index++;
              }
            }
          }
        }

        for (let w = 0; w < cellAchanger.length; w++) {
          const cell = Array.from(cellAchanger[w]);
          this.state[cell[0]][cell[1]] = cell[2];
        }
        this.updated();
        this.run(currentTime);
      } else {
        this.run(date);
      }
    });
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  reset() {
    // TODO
    this.stop();
    this.init();
  }

  isCellAlive(x, y) {
    return x >= 0 &&
      y >= 0 &&
      y < this.height &&
      x < this.height &&
      this.state[y][x] === CELL_STATES.ALIVE
      ? 1
      : 0;
  }
  aliveNeighbours(x, y) {
    let number = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i !== x || j !== y) {
          //if (this.isCellExists(i, j)) {
          if (this.isCellAlive(i, j)) {
            number++;
          }
          //}
        }
      }
    }
    return number;
  }

  isCellExists(x, y) {
    let exist = true;
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      exist = false;
    }
    //drawGame(this);
    return exist;
  }

  subscribe(fn) {
    this.listeObserver.push(fn);
  }

  updated() {
    // TODO update the view
    this.listeObserver.forEach(subcriber => subcriber(this));
  }
}
