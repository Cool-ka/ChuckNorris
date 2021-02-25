import { useEffect, useRef, useState } from 'react'
import { AppBar, Button, Box, Card, CardActions, CardContent, CssBaseline, Container, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  appBar: {
    marginBottom: 20,
    position: 'sticky'
  },
  box: {
    marginBottom: 20
  },
  card: {
    marginBottom: 20
  },
  cardContent: {
    padding: '1rem'
  }
})

function App() {
  const initialFavouriteJokes = () =>  JSON.parse(window.localStorage.getItem('favouriteJokes')) || []  
  const [buttonValue, setButtonValue] = useState(false)
  const [changeInInterval, setChangeInInterval] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [favouriteJokes, setFavouriteJokes] = useState(initialFavouriteJokes)
  const [intervalId, setIntervalId] = useState(null)
  const [jokes, setJokes] = useState([])
  const classes = useStyles();
  const stateRef = useRef();
  const toggle = useRef()
  toggle.current = buttonValue;
  stateRef.current = favouriteJokes;

  const changeTabs = (event, value) => {
    setCurrentTab(value);
  }

  const fetchData = () => {
    // fetches 10 jokes and sets them into joke state
    fetch('http://api.icndb.com/jokes/random/10')
      .then(res => res.json())
      .then(res => setJokes(res.value))
      .catch((err) => console.log(err));
  }

  const fetchRandomJokes = () => {
    // triggers change in button value and will call useEffect to fetch random jokes
    setButtonValue(!toggle.current);
  }

  const setFavourite = (id) => {
    // checks if no more than 10 jokes or if jokes already exists
    if(favouriteJokes.length > 9 || favouriteJokes.find((joke) => joke.id === id)) return;
    // finds the joke
    const favouriteJoke = jokes.find((joke) => joke.id === id);
    // sets the joke in favouriteJoke state
    setFavouriteJokes([favouriteJoke, ...favouriteJokes]);
  }

  const unlike = (id) => {
    // updates the facouriteJoke state to array without unliked joke
    const updatedFavouriteJokes = favouriteJokes.filter((joke) => joke.id !== id);
    // sets new state
    setFavouriteJokes(updatedFavouriteJokes);
  }

  useEffect(() => {
    // do nothing if already 10 favourite jokes
    if(stateRef.current.length > 9) return;
    // if we click the button to start fetching
    if(buttonValue) {
      // sets interval to start retrieving jokes
      const interval = setInterval(() => {
        //sets state to inform that interval is going
        setChangeInInterval(true);
        // sets the interval id in the state
        setIntervalId(interval);
        // fetches one random joke
        fetch('http://api.icndb.com/jokes/random/1')
          .then(res => res.json())
          // sets new favourite joke state with a new joke
          .then(res => setFavouriteJokes(favouriteJokes => ([...res.value, ...favouriteJokes])));
          // if we have enough jokes
          if(stateRef.current.length > 8) {
            // sets state to inform that we need to clear interval
            setChangeInInterval(false);
            // changes the button value to false to inform that we stopped fetching
            setButtonValue(!toggle.current);
          }
      }, 5000)
    }
    if(!buttonValue ) {
      // if we click off the button, inform the state to clear Interval
      setChangeInInterval(false);
    }
  }, [buttonValue])

  useEffect(() => {
    if(!changeInInterval) {
      // if we were informed that the interval needs to be cleared, clear it and sets interval id to null
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [changeInInterval, intervalId])

  useEffect(() => {
    // set favourite jokes into local storage on any change to the array
    window.localStorage.setItem('favouriteJokes', JSON.stringify(favouriteJokes));
  }, [favouriteJokes])


  return (
    <div className="App">
      <CssBaseline />
      <Container>
        <Typography variant='h1' align='center'>
          Chuck Norris Jokes App
        </Typography>
        <AppBar className={classes.appBar}>
          <Tabs value={currentTab} onChange={changeTabs} centered>
            <Tab data-cy="tabIndex" label='Index' id='index-tab' aria-controls='index-panel'/>
            <Tab data-cy="tabFavourite" label='Favourite' id='favourite-tab' aria-controls='favourite-panel'/>
          </Tabs>
        </AppBar>
        <div role='tabpanel' hidden={currentTab !== 0}>
          <Box display='flex' justifyContent='center' className={classes.box}>
            <Button data-cy="fetchButton" variant='outlined' color='primary' onClick={fetchData}>Fetch data</Button>
          </Box>
          {jokes.map(joke => (
            <Card data-cy="jokeCard" key={joke.id} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography>{joke.joke}</Typography>
              </CardContent>
              <CardActions>
                <Button data-cy="likeButton" variant='contained' size='small' color='primary' onClick={() => setFavourite(joke.id)}>Like</Button>
              </CardActions>
            </Card>
          ))}
        </div>
        <div role='tabpanel' hidden={currentTab !== 1}>
          <Typography variant='h4' align='center'>Favourite jokes</Typography>
          <Box display='flex' justifyContent='center' className={classes.box}>
            <Button data-cy="fetchRandomJokeButton" variant='outlined' color='primary' onClick={fetchRandomJokes}>Fetch random jokes</Button>
          </Box>
          {favouriteJokes.map(joke => (
            <Card data-cy="favouriteJokeCard" key={`${joke.id}-favourite`} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography>{joke.joke}</Typography>
              </CardContent>
              <CardActions>
                <Button data-cy="unlikeButton" variant='contained' size='small' color='default' onClick={() => unlike(joke.id)}>Unlike</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
