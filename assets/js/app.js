const searchArtistInput = document.querySelector('#search-input');
const searchArtistButton = document.querySelector('#search-artist-button');
const searchArtistList = document.querySelector('#search-artists-results');
const chosenArtistsList = document.querySelector('#chosen-artists');

const selectedArtists = [];

let currentSearch = [];

let albums = [];

let showAlbumsButtonState = false;

// display selected items on the left on click of Add button
searchArtistList.addEventListener('click', (e) => {
    if (e.target.id.length === 1) {
        pushArtistInfo(currentSearch[e.target.id]);
        e.target.parentElement.style.display = 'none';
        chosenArtistsList.innerHTML = '';
        displaySelectedItems();
    }
})

// retrieve list of albums for entry on click of button
chosenArtistsList.addEventListener('click', (e) => {
    if (e.target.id) {
        const albumList = document.createElement('UL');
        const artistID = selectedArtists[e.target.id.split('-')[2]].id;
        albumList.classList.add('list-group');
        albumList.id = 'list-' + artistID;
        if (document.querySelector(`#${albumList.id}`)) {
            document.querySelector(`#${albumList.id}`).remove();
        }

        e.target.parentElement.append(albumList);
        if (e.target.innerText === 'Show Albums') {
            e.target.classList.remove('btn-success');
            e.target.classList.add('btn-danger');
            e.target.innerText = 'Hide Albums';
            e.target.nextElementSibling.classList.remove('d-none');
        } else {
            e.target.classList.add('btn-success');
            e.target.classList.remove('btn-danger');
            e.target.innerText = 'Show Albums';
            e.target.nextElementSibling.classList.add('d-none');
        }
        showAlbums(artistID, albumList);
    }

})

// search artists on button click
searchArtistButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchArtistInput.value) {
        searchArtistList.innerHTML = '';
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

        artistSelectButton.classList.add('add-button', 'btn', 'btn-primary');
        artistListItem.classList.add('artist-search-result', 'list-group-item');
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
    for (let i = 0; i < selectedArtists.length; i++) {
        const artistListItem = document.createElement('LI');
        artistListItem.classList.add('artist-list-item', 'list-group-item');
        const artistNameParagraph = document.createElement('P');
        const artistSelectButton = document.createElement('BUTTON');
        artistSelectButton.classList.add('btn', 'btn-sm', 'mb-3', 'btn-success');
        artistSelectButton.innerText = 'Show Albums';
        artistSelectButton.id = `selected-artist-${i}`;
        artistNameParagraph.innerText = selectedArtists[i].name;
        artistListItem.append(artistNameParagraph);
        artistListItem.append(artistSelectButton);
        chosenArtistsList.append(artistListItem);
    }
}

//shows albums on click of
function showAlbums(artistId, list) {
    fetch(`https://api.deezer.com/artist/${artistId}/albums`, {
        headers: { Accept: 'application/json' }
    })
        .then((response) => response.json())
        .then((data) => {
            list.innerHTML = '';
            for (let release of data.data) {
                albums.push(release);
            }
            albums.sort((a, b) => { return new Date(b.release_date) - new Date(a.release_date) });
            for (let album of albums) {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.innerHTML = `${album.release_date} - ${album.title}`;
                list.append(listItem);
            }

        });
}


// starting logic to fetch albums of certain period (could be complimented by select or calendar)
function showRecentAlbums() {
    return albums.filter((album) => {
        const year = Number(album.release_date.split('-')[0]);
        return year >= 2020;
    });
}