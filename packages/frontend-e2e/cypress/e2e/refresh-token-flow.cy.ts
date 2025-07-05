describe('Refresh token flow', () => {
  it('should successfully login and navigate through the app while access token is valid', () => {
    cy.login()

    cy.location('pathname').should('eq', '/')
  })

  it('should log out the user on attempt to navigate to the site that requires user to be logged in if refesh token has expired', () => {
    cy.login()
    cy.wait(10500)
    cy.visit('/roles/edit')
    cy.location('pathname').should('eq', '/sign-in')
  })

  it('should log out the user on attempt to open modal if refresh token has expired', () => {
    cy.login()
    cy.wait(10500)
    cy.get('#create-new-article').click()
    cy.location('pathname').should('eq', '/sign-in')
  })

  it('should log out if refresh token is invalid or rejected by the server', () => {})
})
