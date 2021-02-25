import {getFavouriteJoke} from './functions'

test('returns a joke with given id from jokes', () => {
    const jokes = [{id: 1, joke: 'first joke'}, {id: 2, joke: 'second joke'}];
    const favouriteJokes = [{id: 3, joke: 'third joke'}];
    const id = 2;

    expect(getFavouriteJoke(jokes, favouriteJokes, id)).toStrictEqual({id: 2, joke: 'second joke'});
});
test('return false if joke already exists', () => {
    const jokes = [{id: 1, joke: 'first joke'}, {id: 2, joke: 'second joke'}, {id: 3, joke: 'third joke'}];
    const favouriteJokes = [{id: 3, joke: 'third joke'}];
    const id = 3;

    expect(getFavouriteJoke(jokes, favouriteJokes, id)).toBe(false);
});
test('return false if favourite jokes is already at 10 length', () => {
    const jokes = [{id: 1, joke: 'first joke'}, {id: 2, joke: 'second joke'}, {id: 3, joke: 'third joke'}];
    const favouriteJokes = [{},{},{},{},{},{},{},{},{},{}];
    const id = 3;

    expect(getFavouriteJoke(jokes, favouriteJokes, id)).toBe(false);
});