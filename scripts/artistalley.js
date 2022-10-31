var MAX_PER_PAGE = 8;
var slidesHtmlFooter = "<!-- Next\/previous controls --> <div class=\"prev\" onclick=\"plusSlides(-1)\"><a>\
&#10094;<\/a><\/div> <div class=\"next\" onclick=\"plusSlides(1)\"><a>&#10095;<\/a><\/div>";

/* Reading and Randomizing Artists */
async function randomizeArtists() {
    const data = await fetch('artists.json')
    return data.json()
}

/* Filling HTML Templates */

function fillArtists() {
    // Cache of the template
    let template = document.getElementById("template-artist");
    let templateHtml = template.innerHTML;
    let rowHtml = "";

    let templateModal = document.getElementById("template-slide");
    let templateModalHtml = templateModal.innerHTML;
    let slidesHtml = "";

    // Loop through data, replace placeholder tags
    // with actual data, and generate final HTML
    for (var idx = 0; idx < MAX_PER_PAGE; idx++) {
        i = (pageNumber - 1) * MAX_PER_PAGE + idx // Pages are 1-indexed to match existing code
        if (i > artists.length - 1) {
            break;
        }
        // These field names may need to be changed based on your fields
        rowHtml += templateHtml.replace(/{{profilePic}}/g, "../" + artists[i]["profilePic"])
            .replace(/{{name}}/g, artists[i]["name"])
            .replace(/{{description}}/g, artists[i]["description"])
            .replace(/{{commLink}}/g, artists[i]["commLink"])
            .replace(/{{image1}}/g, artists[i]["image1"]) // Assumed to be a src link. If images is an array, fix this
            .replace(/{{image2}}/g, artists[i]["image2"])
            .replace(/{{image3}}/g, artists[i]["image3"])
            .replace(/{{image4}}/g, artists[i]["image4"])
            .replace(/{{slide1}}/g, 4 * idx + 1) // Existing Modal code was 1-indexed
            .replace(/{{slide2}}/g, 4 * idx + 2)
            .replace(/{{slide3}}/g, 4 * idx + 3)
            .replace(/{{slide4}}/g, 4 * idx + 4);

        for (var j = 1; j <= 4; j++) {
            slidesHtml += templateModalHtml.replace(/{{image}}/g, artists[i]["image" + j.toString()]) // Assumed to be a src link. If images is an array, fix this
        }
    }

    slidesHtml += slidesHtmlFooter;

    document.getElementsByClassName("row")[0].innerHTML = rowHtml;
    document.getElementsByClassName("modal-content")[0].innerHTML = slidesHtml;
}

/* Modal fullscreen box */

// Open the Modal
function openModal() {
    modal.style.display = "block";
}

// Close the Modal
function closeModal() {
    modal.style.display = "none";
}

// Next/previous controls
function plusSlides(n) {
    if (slideIndex % 4 == 0 && n == 1) { slideIndex += -4 }
    if (slideIndex % 4 == 1 && n == -1) { slideIndex += 4 }
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array
}

function createDot(page, selected) {
    var a = document.createElement('a');
    a.href = `javascript:setPage(${page})`;

    var span = document.createElement('span');
    span.classList.add(selected ? 'dotf' : 'dote');

    a.appendChild(span);

    return a;
}

var loaded = false;
var artists = [];
var pageNumber = 1;
var pages = Math.ceil(artists.length / MAX_PER_PAGE);
var modal = document.getElementById("myModal");
var slideIndex = 1;

function setPage(pageNum) {
    pageNumber = Math.min(Math.max(1, pageNum), pages);
    fillArtists();
    updatePageDots();
}

function incrementPage(pageNum) {
    setPage(pageNumber + pageNum)
}

/* Main Initialization */
function updatePageDots() {
    // assuming only three dots, it's too late
    // for me to implement a dynamic version so
    // here's some spaghet

    var container = document.getElementById('dot-container');

    container.innerHTML = '';

    for (var i = 1; i <= artists.length / MAX_PER_PAGE; i++) {
        container.appendChild(
            createDot(i, pageNumber == i)
        );
    }
}

randomizeArtists().then((data) => {
    loaded = true;
    artists = shuffleArray(data);
    pages = Math.ceil(artists.length / MAX_PER_PAGE);

    pageNumber = 1;
    fillArtists();
    updatePageDots();

    showSlides(slideIndex);
})


/* Runtime */

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

document.onkeydown = function(e) {
    switch (e.key) {
        case 'ArrowLeft':
            plusSlides(-1);
            break;
        case 'ArrowRight':
            plusSlides(1);
            break;
    }
};