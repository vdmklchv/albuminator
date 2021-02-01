const searchArtistInput = document.querySelector('#search-input');
const searchArtistButton = document.querySelector('#search-artist-button');
const searchArtistList = document.querySelector('#search-artists-results');
const chosenArtistsList = document.querySelector('#chosen-artists');

const selectedArtists = [];

let currentSearch = [];

let albums = [];

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

        e.target.parentElement.parentElement.parentElement.append(albumList);
        showAlbums(artistID, albumList);
    }

})

// search artists on button click
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
        artistSelectButton.classList.add('add-button', 'btn', 'btn-primary');
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
    for (let i = 0; i < selectedArtists.length; i++) {
        const artistListItem = document.createElement('LI');
        artistListItem.classList.add('artist-list-item');
        const artistNameParagraph = document.createElement('P');
        const artistSelectButton = document.createElement('BUTTON');

        artistListItem.classList.add('list-group-item');
        artistSelectButton.classList.add('btn', 'btn-success', 'btn-sm');
        artistNameParagraph.innerText = selectedArtists[i].name;
        artistSelectButton.id = `selected-artist-${i}`;
        artistSelectButton.innerText = 'Show Albums';
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
            for (release of data.data) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `${release.release_date} - ${release.title}`;
                list.append(listItem);
                albums.push(release);

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