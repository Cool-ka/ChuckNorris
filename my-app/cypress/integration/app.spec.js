describe('App works', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('displays correct title', () => {
    cy.get('h1').contains('Chuck Norris Jokes App')
    expect(true).to.equal(true)
  })
  it('has two tabs', () => {
    cy.get('[data-cy=tabIndex]').children().first().contains('Index')
    cy.get('[data-cy=tabFavourite]').children().first().contains('Favourite')
  })
  it('has fetch button', () => {
    cy.get('[data-cy=fetchButton]').contains('Fetch data')
  })
  it('retrieves 10 jokes when clicking on fetchData button', () => {
    cy.get('[data-cy=fetchButton]').click()
    cy.get('[data-cy=jokeCard]').should('have.length', 10)
  })
  it('clicks like button and adds it to favourite tab', () => {
    cy.get('[data-cy=fetchButton]').click()
    cy.get('[data-cy=likeButton]').first().click()
    cy.get('[data-cy=tabFavourite]').click()
    cy.get('[data-cy="favouriteJokeCard"]').should('have.length', 1)
  })
  it('favourite jokes are stored after refresh', () => {
    cy.get('[data-cy=fetchButton]').click()
    cy.get('[data-cy=likeButton]').first().click()
    cy.get('[data-cy=tabFavourite]').click()
    cy.get('[data-cy="favouriteJokeCard"]').should('have.length', 1)
    cy.reload()
    cy.get('[data-cy="favouriteJokeCard"]').should('have.length', 1)
  })
  it('clicks unlike button and joke is being removed', () => {
    cy.get('[data-cy=fetchButton]').click()
    cy.get('[data-cy=likeButton]').first().click()
    cy.get('[data-cy=tabFavourite]').click()
    cy.get('[data-cy=unlikeButton]').click()
    cy.get('[data-cy="favouriteJokeCard"]').should('have.length', 0)
  })
  it('clicks fetch random jokes button, adds two jokes (each after 5s), clicks again and it stops fetching', () => {
    cy.get('[data-cy=tabFavourite]').click()
    cy.get('[data-cy="fetchRandomJokeButton"]').click()
    cy.wait(6000)
    cy.get('[data-cy="favouriteJokeCard"]').should('have.length', 1)
    cy.wait(6000)
    cy.get('[data-cy="favouriteJokeCard"]').should('have.length', 2)
    cy.get('[data-cy="fetchRandomJokeButton"]').click()
    cy.wait(6000)
    cy.get('[data-cy="favouriteJokeCard"]').should('have.length', 2)
  })
})