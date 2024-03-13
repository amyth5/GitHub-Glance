const searchbar = document.querySelector(".searchbar-container");
const profilecontainer = document.querySelector(".profile-container");
const root = document.documentElement.style;

const get = (param) => document.getElementById(`${param}`);

const url = "https://api.github.com/users/";

const noresults = get("no-results");
const btnmode = get("btn-mode");
const modetext = get("mode-text");
const modeicon = get("mode-icon");
const btnsubmit = get("submit");
const input = get("input");
const avatar = get("avatar");
const userName = get("name");
const user = get("user");
const date = get("date");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const bio = get("bio");
const repos = get("repos");
const followers = get("followers");
const following = get("following");
const user_location = get("location");
const page = get("page");
const twitter = get("twitter");
const company = get("company");

let darkModeEnabled = false;




// Event Listeners
btnsubmit.addEventListener("click", function () {

  if (input.value !== "") {
    getUserData(url + input.value);
  }
});

input.addEventListener(
  "keydown",
  function (e) {
    if (e.key == "Enter") {
      if (input.value !== "") {
        getUserData(url + input.value);
      }
    }
  },
  false
);

input.addEventListener("input", function () {
  noresults.style.display = "none";
});


btnmode.addEventListener("click", function () {

  if (darkModeEnabled === false) {
    darkModeProperties();
  } else {
    lightModeProperties();
  }
});



// Functions

//API CALL
function getUserData(gitUrl) {
  fetch(gitUrl)
    .then((response) => response.json())
    .then((data) => updateProfile(data) )
    .catch((error) => {
      throw error;
    });
}






//RENDERING data recieved from API
// data is in the json format which has been parsed from response

function updateProfile(data) {

  // checking id if data fetched from API is valid or not
  //  the API response for an existing user does not include a message field. i.e. it will include message field when the user doesn't exist
  // so, if the message field does not exist in the data object, accessing data.message will result in undefined
  
  if (data.message !== "Not Found") {




    noresults.style.display = "none"; // "user not found" message will not show


    //  checks if th field is null or empty
    
    function checkNull(param1, param2) {



      if (param1 === "" || param1 === null) {

        // so if no data is available for param1
        // its opacity will be change along with the icons'

        param2.style.opacity = 0.5;
        param2.previousElementSibling.style.opacity = 0.5;

        return false;

      }
       else {
        return true;
      }
    }





    avatar.src = `${data.avatar_url}`;


    
    // If the user has provided their name, their name is displayed; otherwise, their GitHub username is displayed.
    userName.innerText = data.name === null ? data.login : data.name;



    user.innerText = `@${data.login}`;
    user.href = `${data.html_url}`;

    // "created_at": "2023-02-04T05:56:44Z", 

    datesegments = data.created_at.split("T").shift().split("-");

    // if data.created_at is "2023-02-04T05:56:44Z", then datesegments will be ["2023", "02", "04"],

    date.innerText = `Joined ${datesegments[2]} ${months[datesegments[1] - 1]} ${datesegments[0]}`;
    

    bio.innerText = data.bio == null ? "This profile has no bio" : `${data.bio}`;

    repos.innerText = `${data.public_repos}`;
    followers.innerText = `${data.followers}`;
    following.innerText = `${data.following}`;


    user_location.innerText = checkNull(data.location, user_location) ? data.location : "Not Available";
    
    page.innerText = checkNull(data.blog, page) ? data.blog : "Not Available";
    page.href = checkNull(data.blog, page) ? data.blog : "#";

    
    twitter.innerText = checkNull(data.twitter_username, twitter) ? data.twitter_username : "Not Available";
    twitter.href = checkNull(data.twitter_username, twitter) ? `https://twitter.com/${data.twitter_username}` : "#";
    
    company.innerText = checkNull(data.company, company) ? data.company : "Not Available";
  
    

    profilecontainer.style.display = "block";

  } else {

    //No response from API
    noresults.style.display = "block";
    profilecontainer.style.display = "none";
  }
}




function darkModeProperties() {


  root.setProperty("--lm-bg", "#141D2F");
  root.setProperty("--lm-bg-content", "#1E2A47");
  root.setProperty("--lm-text", "white");
  root.setProperty("--lm-text-alt", "white");
  root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");

  modetext.innerText = "LIGHT";

  modeicon.src = "./assets/images/sun-icon.svg";

  root.setProperty("--lm-icon-bg", "brightness(1000%)");

  

  // dark mode has bee set 
  darkModeEnabled = true;

  
  localStorage.setItem("dark-mode-enabled", true);  


}


function lightModeProperties() {


  root.setProperty("--lm-bg", "#F6F8FF");
  root.setProperty("--lm-bg-content", "#FEFEFE");
  root.setProperty("--lm-text", "#4B6A9B");
  root.setProperty("--lm-text-alt", "#2B3442");
  root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");

  modetext.innerText = "DARK";
  modeicon.src = "./assets/images/moon-icon.svg";

  root.setProperty("--lm-icon-bg", "brightness(100%)");

  // light mode hase been enabled so marking darkmodeEnabled as false

  darkModeEnabled = false;

  localStorage.setItem("dark-mode-enabled", false);

  
}





//INITIALISING UI


function init() {

  const value = localStorage.getItem("dark-mode-enabled");

  if(value === null) {

    // there is nothing stored initially in localstorage and hence  localStorage.getItem("dark-mode")= null

    localStorage.setItem("dark-mode-enabled", darkModeEnabled);
    
    // default light mode
    lightModeProperties();

  }
  else if(value == "true") {

    darkModeProperties();
  
  }
  else if(value == "false") {
    
    lightModeProperties();

  }


  // setting default value to amyth5 just to show something
  getUserData(url + "amyth5");
} 

init();