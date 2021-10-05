/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default image if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove hard coded data.
  let response = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: query } }); 

  const genericImg = 'http://tinyurl.com/missing-tv';

  if (response.data.length >= 1){
    let shows = response.data.map( result => {
      let show = result.show;
      return {
      id: show.id,
      name: show.name,
      rating: show.rating ? show.rating.average : 'No ratings',
      summary: show.summary,
      image: show.image ? show.image.medium : genericImg
      }
    }); 

    return shows;

  } else {
    alert(`Could not find ${query}`);
  }
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <div class="card h-100" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text text-primary">${show.rating}</p>
            <p class="card-text">${show.summary}</p>
            <button type="button" class="btn btn-primary get-episodes" data-bs-toggle="modal" data-bs-target="#episode-modal">Episodes</button>
          </div>
        </div>
      </div>
      `);

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze with GET request to http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`); 

  // TODO: return array-of-episode-info, as described in docstring above
  let episodes = response.data.map( episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}

const $episodesList = $("#episodes-list");

function populateEpisodes(episodes) {
  for (let episode of episodes) {
    $episodesList.append(`<li>${episode.name} - (Season ${episode.season}, Episode ${episode.number})</li>`)
  }
  //$("#episodes-area").show();
}

/** Handle click on show name. */

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  //$episodesList.empty();

  let showId = $(evt.target).closest(".card").data("show-id");
  let episodes = await getEpisodes(showId);

  populateEpisodes(episodes);
});