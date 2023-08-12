const createMissIcon = () => {
  var missIcon = document.createElement("div");
  missIcon.classList.add("fa-solid", "fa-water", "fa-beat");

  setTimeout(function () {
    missIcon.classList.remove("fa-beat");
  }, 1000);

  return missIcon;
};

export default createMissIcon;
