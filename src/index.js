const char = document.querySelector("#character-bar");
const nam = document.querySelector("#name");
const img = document.querySelector("#image");
const voteCount = document.querySelector("#vote-count");
const voteForm = document.querySelector("#votes-form");
const inputVote = document.querySelector("#votes");
const resetButton = document.querySelector("#reset-btn");
const charForm = document.querySelector("#character-form");
const charNameInput = document.querySelector("#character-form #name");
const charImageInput = document.querySelector("#character-form #image-url");

let selectedChar = null;


function fetchCharacters() {
    fetch("http://localhost:3000/characters")
        .then(res => res.json())
        .then(characters => {
            characters.forEach(renderCharacter);
        })
        .catch(error => console.error("Error fetching characters:", error));
}


function renderCharacter(character) {
    const span = document.createElement("span");
    span.textContent = character.name;
    span.style.cursor = "pointer";
    span.style.marginRight = "10px";


    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.style.marginLeft = "5px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        deleteCharacter(character.id, span);
    });

    span.addEventListener("click", () => displayChar(character));

    span.appendChild(deleteBtn);
    char.appendChild(span);
}


function displayChar(character) {
    selectedChar = character;
    nam.textContent = character.name;
    img.src = character.image;
    voteCount.textContent = character.votes;
}


voteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!selectedChar) {
        alert("Please select a character first!");
        return;
    }

    const newVotes = parseInt(inputVote.value, 10);

    if (isNaN(newVotes) || newVotes < 0) {
        alert("Please enter a valid positive number!");
        return;
    }

    selectedChar.votes += newVotes;
    voteCount.textContent = selectedChar.votes;

    updateVotes(selectedChar);
    inputVote.value = "";
});


resetButton.addEventListener("click", () => {
    if (!selectedChar) {
        alert("Please select a character first!");
        return;
    }

    selectedChar.votes = 0;
    voteCount.textContent = "0";
    updateVotes(selectedChar);
});


function updateVotes(character) {
    fetch(`http://localhost:3000/characters/${character.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: character.votes })
    })
    .then(res => res.json())
    .then(data => console.log("Votes updated:", data))
    .catch(error => console.error("Error updating votes:", error));
}


charForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newCharacter = {
        name: charNameInput.value,
        image: charImageInput.value,
        votes: 0
    };

    fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharacter)
    })
    .then(res => res.json())
    .then(character => {
        renderCharacter(character);
        displayChar(character); 
    })
    .catch(error => console.error("Error adding character:", error));

    charForm.reset();
});


function deleteCharacter(id, element) {
    fetch(`http://localhost:3000/characters/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        element.remove(); 
        console.log("Character deleted:", id);
    })
    .catch(error => console.error("Error deleting character:", error));
}


document.addEventListener("DOMContentLoaded", fetchCharacters);
