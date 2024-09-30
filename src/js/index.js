// setup axios
const axios= require('axios');
import styles from "../css/style.css";



const input = document.querySelector("#site-search");
let errorP = document.createElement('p');
const loader=document.querySelector('.loader');
const list = document.querySelector(".list");
const searchBtn = document.querySelector(".search-btn");

errorP.classList.add('error-paragraph');


input.value="";


// Function for showing and hiding  loader
const toggleLoader = (show) => {
  if (show) {
    loader.classList.remove("hidden");
  } else {
    loader.classList.add("hidden");
  }
};
// Function creste elements in  HTML whith classi
const createElement = (type, classNames, text = "") => {
  const element = document.createElement(type);
  element.classList.add(...classNames);
  if (text) element.innerText = text;
  return element;
};


// api call

const getData = async () =>{
    // we take the keyword inserted by the user and adjust it for use it into the query
  let inputValue = input.value.trim().toLowerCase().split(" ").join("");

  if(inputValue === "") {                           // if the user starts research without a keyword
    errorP.innerText = "Please insert a keyword.";  // notify the user
    document.body.appendChild(errorP);
    input.value = "";              
    return;
  };


  toggleLoader(true); // show the loader 

  try {
    // send a get request to open library
    const res = await axios.get(
      `https://openlibrary.org/subjects/${inputValue}.json`
    );

    toggleLoader(false); // hide the loader

    
    if (res.data.work_count !== 0) {
      const works = res.data.works;
      // we create a card for every work given to us by the api call
      works.forEach(work => createCard(work));
    } else {
      showError("No match found.");
    }
  } catch (e) {
    toggleLoader(false); 
    showError("No match found.");
    console.log("ERROR!", e);
  }

  input.value = "";
};

// Fucrion for show  error
const showError = (message) => {
  errorP.innerText = message;
  document.body.appendChild(errorP);
};

// make the second API call and fetch the description of the selected book
const getDescription = async (key) => {
  try {
    const res = await axios.get(`https://openlibrary.org${key}.json`);
    if (res.data && res.data.description && res.data.description.value) {
      return res.data.description.value;
    } else if (res.data && res.data.description) {
      return res.data.description;
    } else {
      return "No description available.";
    }
  } catch (e) {
    console.log("ERROR!", e);
  }
};

// Crate a card to fetch each book
const createCard = (work) => {
  const newLi = createElement("li", ["list-item"]);
  const h3 = createElement("h3", ["h3"], work.title);
  const author = createElement("span", ["author"], work.authors[0].name);
  const readMore = createElement("button", ["read-more"], "Show More");
  const descriptionP = createElement("p", ["description-paragraph"]);

  newLi.appendChild(h3);
  newLi.appendChild(author);
  newLi.appendChild(readMore);
  list.appendChild(newLi);

  let descriptionLoaded = false; // Flag per sapere se la descrizione è stata caricata

  readMore.addEventListener("click", async () => {
    if (readMore.innerText === "Show More") {
      if (!descriptionLoaded) { // if the description is not loaded
        let description = await getDescription(work.key);
        descriptionP.innerText = description;
        newLi.appendChild(descriptionP);
        descriptionLoaded = true; 
      }
      descriptionP.style.display = "block"; 
      readMore.innerText = "Show Less";
    } else {
      descriptionP.style.display = "none"; 
      readMore.innerText = "Show More";
    }
  });
};



// manipulate search button behavior
searchBtn.addEventListener("click", (event) => {
  // prevent the default behavior of the button, then we empty the list, the error paragraph and launch a request
  event.preventDefault();
  list.innerText = "";
  errorP.innerText = "";
  getData();
});