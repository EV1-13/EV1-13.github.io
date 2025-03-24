const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}

const storyText = 'It was 63 fahrenheit outside, so :insertx: went to go fly to a fun place. When they got to :inserty:, they looked blankly at the situation, not a single thought in their head, then :insertz:. Schlorbo saw the whole thing, and was spooked, knowing that :insertx: weighed 2 pounds. It was a freaky day.';
const insertX = ['Five Pebbles', 'Looks to the Moon', 'Slugcat'];
const insertY = ['the Shaded Citadel', 'the Shoreline', 'the Subterranean'];
const insertZ = ['exploded into little tiny bits', 'became a tree', 'won a million billion dollars'];

randomize.addEventListener('click', result);

function result() {
  let newStory = storyText;

  const xItem = randomValueFromArray(insertX);
  const yItem = randomValueFromArray(insertY);
  const zItem = randomValueFromArray(insertZ);

  newStory = newStory.replaceAll(':insertx:',xItem);
  newStory = newStory.replaceAll(':inserty:',yItem);
  newStory = newStory.replaceAll(':insertz:',zItem);

  if (customName.value !== '') {
    const name = customName.value;
    newStory = newStory.replaceAll('Schlorbo', name);
  }

  if (document.getElementById("uk").checked) {
    const weight = `${Math.round(300*0.0714286)} stone`;
    const temperature =  `${Math.round((94-32) * 5 / 9)} centigrade`;
    newStory = newStory.replaceAll('63 fahrenheit', temperature);
    newStory = newStory.replaceAll('2 pounds', weight);
  }

  story.textContent = newStory;
  story.style.visibility = 'visible';
}