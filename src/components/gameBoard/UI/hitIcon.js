const createHitIcon = () => {
  var hitIcon = document.createElement("div");
  hitIcon.classList.add("fa-solid", "fa-explosion", "fa-shake");

  setTimeout(function () {
    hitIcon.classList.remove("fa-shake");
  }, 1000);

  return hitIcon;
};

export default createHitIcon;
