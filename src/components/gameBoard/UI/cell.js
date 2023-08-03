import "./cell.css";

const numToLetter = (num) => {
  return String.fromCharCode(num + 64);
};

const Cell = (label, row, col) => {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  if (label) {
    // If first cell
    if (label === "/") {
      cell.innerHTML = "";
      cell.classList.add("non-playable");
    }
    // If letter
    else if (typeof label === "string") {
      cell.innerHTML = label;
      cell.classList.add("letter-label");
    }
    // If number
    else if (Number.isFinite(label)) {
      cell.innerHTML = label;
      cell.classList.add("number-label");
    }
  }
  // Playable cell
  else {
    cell.classList.add("playable-cell");
    cell.dataset.letter = numToLetter(col);
    cell.dataset.number = row;
  }

  return cell;
};

export default Cell;
