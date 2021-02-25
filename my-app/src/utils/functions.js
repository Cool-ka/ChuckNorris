export function getFavouriteJoke(jokes, favouriteJokes, id) {
    if(favouriteJokes.length > 9 || favouriteJokes.find((joke) => joke.id === id)) return false;
    return jokes.find((joke) => joke.id === id);
}