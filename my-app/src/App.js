import { useState } from 'react'
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
  const [jokes, setJokes] = useState([])
  const [favouriteJokes, setFavouriteJokes] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const classes = useStyles();
  
  const fetchData = () => {
    fetch('http://api.icndb.com/jokes/random/10')
      .then(res => res.json())
      .then(res => setJokes(res.value))
      .catch((err) => console.log(err))
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

  return (
    <div className="App">
      <CssBaseline />
      <Container>
        <Typography variant='h1' align='center'>
          Chuck Norris Jokes App
        </Typography>
        <AppBar className={classes.appBar}>
          <Tabs value={currentTab} onChange={changeTabs} centered>
            <Tab label='Index' id='index-tab' aria-controls='index-panel'/>
            <Tab label='Favourite' id='favourite-tab' aria-controls='favourite-panel'/>
          </Tabs>
        </AppBar>
        <div role='tabpanel' hidden={currentTab !== 0}>
        <Box display='flex' justifyContent='center' className={classes.box}>
          <Button variant='outlined' color='primary' onClick={fetchData}>Fetch data</Button>
        </Box>
          {jokes.map(joke => (
            <Card key={joke.id} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography>{joke.joke}</Typography>
              </CardContent>
              <CardActions>
                <Button variant='contained' size='small' color='primary' onClick={() => setFavourite(joke.id)}>Like</Button>
              </CardActions>
            </Card>
          ))}
        </div>
        <div role='tabpanel' hidden={currentTab !== 1}>
          <Typography variant='h4' align='center'>Favourite jokes</Typography>
          {favouriteJokes.map(joke => (
            <Card key={joke.id} className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography>{joke.joke}</Typography>
              </CardContent>
              <CardActions>
                <Button variant='contained' size='small' color='default' onClick={() => unlike(joke.id)}>Unlike</Button>
              </CardActions>
            </Card>
          ))}
        </div>        
      </Container>
    </div>
  );
}

export default App;
