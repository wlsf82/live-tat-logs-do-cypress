Cypress.Commands.add('login', () => {
  Cypress.log({
    name: 'login',
    displayName: 'LOGIN',
    message: `Logging in as ${Cypress.env('USER_EMAIL')}`
  })

  cy.intercept('GET', '**/notes').as('getNotes')
  cy.visit('/login')
  cy.get('#email')
    .should('be.visible')
    .type(Cypress.env('USER_EMAIL'))
  cy.get('#password')
    .should('be.visible')
    .type(Cypress.env('USER_PASSWORD'), { log: false })
  cy.get('button[type="submit"]')
    .should('be.visible')
    .click()
  cy.wait('@getNotes')
  cy.contains('Your Notes').should('be.visible')
})

Cypress.Commands.add('createNote', note => {
  cy.log(`Creating note ${note.initialValue}`)
  cy.intercept('POST', '**/notes').as('postNote')
  cy.visit('/notes/new')
  cy.get('#content').type(note.initialValue)
  cy.get('button:contains(Create)').click()
  cy.wait('@postNote')
    .its('response.body.noteId', { log: false })
    .then(noteId => {
      Cypress.log({
        name: 'noteId',
        displayName: 'NOTE ID',
        message: noteId
      })
    })
  cy.wait('@getNotes')
})

Cypress.Commands.add('editNote', note => {
  Cypress.log({
    name: 'editNote',
    displayName: 'EDIT NOTE',
    message: `Editing note ${note.initialValue} to be ${note.newValue}`
  })

  cy.intercept('PUT', '**/notes/**').as('putNote')
  cy.get(`a.list-group-item:contains(${note.initialValue})`)
    .should('be.visible')
    .click()
  cy.get('#content').clear().type(note.newValue)
  cy.get('button:contains(Save)').click()
  cy.wait('@putNote')
  cy.wait('@getNotes')
})

Cypress.Commands.add('deleteNote', note => {
  Cypress.log({
    name: 'deleteNote',
    displayName: 'DELETE NOTE',
    message: `Deleting note ${note}`
  })

  cy.intercept('DELETE', '**/notes/**').as('deleteNote')
  cy.get(`a.list-group-item:contains(${note})`)
    .should('be.visible')
    .click()
  cy.get('.btn-danger').click()
  cy.wait('@deleteNote')
  cy.wait('@getNotes')
})

Cypress.Commands.add('assertNoteIsOnTheList', note => {
  cy.get('.list-group').should('be.visible')
  cy.get(`.list-group-item-heading:contains(${note})`)
    .should('be.visible')
})

Cypress.Commands.add('assertNoteDoesNotExistOnTheList', note => {
  cy.get('.list-group').should('be.visible')
  cy.get(`.list-group-item-heading:contains(${note})`)
    .should('not.exist')
})
