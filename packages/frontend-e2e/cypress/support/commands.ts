Cypress.Commands.add('login', () => {
  cy.fixture('auth').then(({ username, password }) => {
    cy.visit('/sign-in')

    cy.get('input[name="username"]').click().type(username)
    cy.get('input[name="password"]').click().type(password)
    cy.get('button[name="submit"]').click()
  })
})
