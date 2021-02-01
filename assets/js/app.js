const searchArtistInput = document.querySelector('#search-input');
const searchArtistButton = document.querySelector('#search-artist-button');
const searchArtistList = document.querySelector('#search-artists-results');
const chosenArtistsList = document.querySelector('#chosen-artists');


const selectedArtists = [];

let currentSearch = [];

searchArtistList.addEventListener('click', (e) => {
    pushArtistInfo(currentSearch[e.target.id]);
    e.target.parentElement.style.display = 'none';
    displaySelectedItems();
})

chosenArtistsList.addEventListener('click', (e) => {
    if (e.target.id) {
        const albumList = document.createElement('UL');
        const artistID = selectedArtists[e.target.id.split('-')[2]].id;
        albumList.id = artistID;
        e.target.parentElement.append(albumList);
        showAlbums(artistID, albumList);
    }

})


searchArtistButton.addEventListener('click', (e) => {
    if (searchArtistInput.value) {
        searchArtistList.innerHTML = '';
        e.preventDefault();
        const query = searchArtistInput.value;
        searchArtistInput.value = '';
        fetch(`https://api.deezer.com/search/artist/?q=${query}`)
            .then((response) => response.json())
            .then((data) => {
                showArtistSearchResults(data.data);
                currentSearch = data.data;
            });
    }
})

// create artist search results
function showArtistSearchResults(artists) {
    for (let i = 0; i < artists.length; i++) {
        const artistName = artists[i].name;
        const artistListItem = document.createElement('LI');
        const artistNameParagraph = document.createElement('P');
        const artistSelectButton = document.createElement('BUTTON');
        artistSelectButton.classList.add('add-button');
        artistListItem.classList.add('artist-search-result');
        artistSelectButton.id = `${i}`;
        artistNameParagraph.innerText = artistName;
        artistNameParagraph.style.display = 'inline-block';
        artistSelectButton.innerText = 'Add';
        artistListItem.append(artistNameParagraph);
        artistListItem.append(artistSelectButton);
        searchArtistList.append(artistListItem);
    }
}

function pushArtistInfo(artist) {
    selectedArtists.push(artist);
}

function displaySelectedItems() {
    chosenArtistsList.innerHTML = '';
    for (let i = 0; i < selectedArtists.length; i++) {
        const artistListItem = document.createElement('LI');
        const artistNameParagraph = document.createElement('P');
        const artistSelectButton = document.createElement('BUTTON');

        artistNameParagraph.innerText = selectedArtists[i].name;
        artistSelectButton.id = `selected-artist-${i}`;
        artistSelectButton.innerText = 'Show Albums';
        artistListItem.append(artistNameParagraph);
        artistListItem.append(artistSelectButton);
        chosenArtistsList.append(artistListItem);

    }
}

function showAlbums(artistId, list) {
    fetch(`https://api.deezer.com/artist/${artistId}/albums`, {
        headers: { Accept: 'application/json' }
    })
        .then((response) => response.json())
        .then((data) => {
            for (release of data.data) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${release.release_date} - ${release.title}`;
                list.append(listItem);
            }
        });
}