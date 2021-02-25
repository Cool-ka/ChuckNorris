import { useRef, useEffect, useState } from 'react'
import { AppBar, Button, Box, Card, CardActions, CardContent, CssBaseline, Container, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  appBar: {
    marginBottom: 20,
    position: 'sticky'
  },
  card: {
    marginBottom: 20
  },
  cardContent: {
    padding: '1rem'
  },
  box: {
    marginBottom: 20
  }
})

function App() {
  const initialFavouriteJokes = () =>  JSON.parse(window.localStorage.getItem('favouriteJokes')) || []
  const [jokes, setJokes] = useState([])
  const [favouriteJokes, setFavouriteJokes] = useState(initialFavouriteJokes)
  const [currentTab, setCurrentTab] = useState(0)
  const [buttonValue, setButtonValue] = useState(false)
  const [intervalId, setIntervalId] = useState(null)
  const [changeInInterval, setChangeInInterval] = useState(false)
  const classes = useStyles();
  const stateRef = useRef();
  const toggle = useRef()
  toggle.current = buttonValue;
  stateRef.current = favouriteJokes;

  const fetchData = () => {
    fetch('http://api.icndb.com/jokes/random/10')
      .then(res => res.json())
      .then(res => setJokes(res.value))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    if(stateRef.current.length > 9) return;
    if(buttonValue) {
      const interval = setInterval(() => {
        setChangeInInterval(true)
        setIntervalId(interval)
        fetch('http://api.icndb.com/jokes/random/1')
          .then(res => res.json())
          .then(res => setFavouriteJokes(favouriteJokes => ([...res.value, ...favouriteJokes])))
          if(stateRef.current.length > 8) {
            setChangeInInterval(false)
            setButtonValue(!toggle.current)
          }
      }, 5000)
    }
    if(!buttonValue ) {
      setChangeInInterval(false)
    }
  }, [buttonValue])

  useEffect(() => {
    if(!changeInInterval) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }, [changeInInterval, intervalId])

  const fetchRandomJokes = () => {
    setButtonValue(!toggle.current)
  }

  const setFavourite = (id) => {
    if(favouriteJokes.length > 9 || favouriteJokes.find((joke) => joke.id === id)) return;
    const favouriteJoke = jokes.find((joke) => joke.id === id);
    setFavouriteJokes([favouriteJoke, ...favouriteJokes])
  }

  const unlike = (id) => {
    const updatedFavouriteJokes = favouriteJokes.filter((joke) => joke.id !== id);
    setFavouriteJokes(updatedFavouriteJokes);
  }

  const changeTabs = (event, value) => {
    setCurrentTab(value)
  }

  useEffect(() => {
    window.localStorage.setItem('favouriteJokes', JSON.stringify(favouriteJokes))
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
