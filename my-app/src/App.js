import { useState } from 'react'
import { Button, Box, Card, CardActions, CardContent, CssBaseline, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
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

  return (
    <div className="App">
      <CssBaseline />
      <Container>
        <Typography variant='h1' align='center'>
          Chuck Norris Jokes App
        </Typography>
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
      </Container>
    </div>
  );
}

export default App;
