const duckDisplay = document.querySelector('#duck-display');


function loadDuckToDuckDisplay(duckObject) {

    const newDiv = document.createElement('div');
    newDiv.setAttribute("id", "duck-display");
    const newH2 = document.createElement('h2');
    newH2.textContent = duckObject.name;
    const newImg = document.createElement('img');
    newImg.src = duckObject.img_url;
    const newButton = document.createElement('button');
    newButton.textContent = duckObject.likes;

    // Click like button to increment count
    newButton.addEventListener('click', () => {
        const OPTIONS = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                likes: ++duckObject.likes,
            })
        }
        // Patch like count increment to db
        fetch('http://localhost:3000/ducks/' + duckObject.id, OPTIONS)
        .then(resp => resp.json())
        .then(data => {
            // Render new count on page (pessimistically!)
            newButton.textContent = duckObject.likes;
        });
    })

    // Build duck display card 
    newDiv.appendChild(newH2);
    newDiv.appendChild(newImg);
    newDiv.appendChild(newButton);

    // Replace previous duck display card with new one ...
    if (duckDisplay.hasChildNodes) {
        duckDisplay.replaceChildren(newDiv);
    } else {
        // ... or simply add the new card, if it's the first
        duckDisplay.appendChild(newDiv);
    }
}

// Get nav bar node
const duckNav = document.querySelector('#duck-nav');

function addDuckToNav(duckObject) {
    // Populate nav bar
    const newImg = document.createElement('img');
    newImg.src = duckObject.img_url;
    duckNav.appendChild(newImg);

    // Let user select and view ducks from nav bar
    newImg.addEventListener('click', (e) => {
        loadDuckToDuckDisplay(duckObject);
    })
}

// Populate nav bar from db
fetch(`http://localhost:3000/ducks`)
.then(resp => resp.json()) 
.then(data => {
    // Load first duck to display so it doesn't look weird and empty
    loadDuckToDuckDisplay(data[0]);

    data.forEach(duckObject => {
        addDuckToNav(duckObject);
    })
})


// ## Deliverable Four

// When the `#new-duck-form` is submitted, it generates a new duck image in the `#duck-nav`. When clicked, it acts like the other images in the `#duck-nav` and shows a name, image, and like button in the `#duck-display`. No persistence is needed. A duck starts with 0 likes.

const newDuckForm = document.querySelector('#new-duck-form');
newDuckForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target['duck-name-input'].value;
    const url = e.target['duck-image-input'].value;
    console.log(name, url);
    const duckObject = {
        name: name,
        img_url: url,
        likes: 0,
      }
    // Post duck to db
    const OPTIONS = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(duckObject),
    };
    fetch(`http://localhost:3000/ducks`, OPTIONS)
    .then(resp => resp.json())
    .then(data => {
        addDuckToNav(data);
    });
    e.target.reset();
})
