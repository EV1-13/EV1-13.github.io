const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');
const text = document.querySelector('h1');


/* Declaring the array of image filenames */
const images = ["/img/ultrakill-dunk.gif", "/img/slugcat-vibe.gif", "/img/ratfight_title.gif", "/img/jerma.webp", "/img/helldivers2-chestbump.gif"];

/* Declaring the alternative text for each image file */
const alts = ["pic1", "pic2", "pic3", "pic4", "pic5"];

/* Looping through images */

for (let i = 0; i < images.length; i++) {
const newImage = document.createElement('img');
newImage.setAttribute('src', images[i]);
newImage.setAttribute('alt', alts[i]);
thumbBar.appendChild(newImage); 

newImage.addEventListener("click", () => {
    displayedImage.setAttribute('src', images[i]);
    displayedImage.setAttribute('alt', alts[i]);
});
}

/* Wiring up the Darken/Lighten button */

btn.addEventListener("click", () => {
    let pageState = btn.getAttribute("class");
    
    if (pageState === "dark") {
        btn.setAttribute("class", "light");
        btn.textContent = "Darken";
        overlay.style.backgroundColor = "rgb(0 0 0 / 0%)";
        body.style.backgroundColor = "rgb(243, 187, 196)";
        text.style.color = "black";
        btn.style.background = "rgba(86, 86, 86, 0.6)";
    } else {
        btn.setAttribute("class", "dark");
        btn.textContent = "Lighten";
        overlay.style.backgroundColor = "rgb(0 0 0 / 50%)";
        body.style.backgroundColor = "rgb(36, 12, 59)";
        text.style.color = "white";
        btn.style.background = "rgba(230, 230, 230, 0.6)";
    }
});
