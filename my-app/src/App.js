import {useEffect, useState } from 'react'
import { Card, CardContent, CssBaseline, Container, Typography } from '@material-ui/core';

function App() {
  const [jokes, setJokes] = useState([])
  useEffect(() => {
    fetch('http://api.icndb.com/jokes/random/10')
    .then(res => res.json())
    .then(res => setJokes(res.value))
    .catch((err) => console.log(err))
  }, [])
  return (
    <div className="App">
      <CssBaseline/>
      <Container>
        <Typography variant='h1' align='center'>
          Chuck Norris Jokes App
        </Typography>
        {jokes.map(joke => (
          <Card key={joke.id}>
            <CardContent>
              <Typography>{joke.joke}</Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    </div>
  );
}

export default App;
