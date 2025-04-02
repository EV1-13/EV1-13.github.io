import { VFX } from "https://esm.sh/@vfx-js/core";
class ButtonEffect {
  constructor(button) {
    this.vfx = this.vfx = new VFX();
    button.addEventListener("mouseenter", (e) => {
      this.vfx.add(button, { shader: "glitch", overflow: 100 });
    });

    button.addEventListener("mouseleave", (e) => {
      this.vfx.remove(button);
    });
    
     button.addEventListener("click", (e) => {
       
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
  document.body.style.backgroundColor = "#" + randomColor;
  color.innerHTML = "#" + randomColor;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ButtonEffect(document.querySelector("button"));
});
