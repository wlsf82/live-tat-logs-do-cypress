const faker = require('faker')

describe('Notes', () => {
  beforeEach(() => cy.login())

  it('creates, reads, updates, and deletes a note', () => {
    const note = {
      initialValue: faker.random.word(),
      newValue: faker.random.word()
    }

    cy.createNote(note)
    cy.assertNoteIsOnTheList(note.initialValue)

    cy.editNote(note)
    cy.assertNoteIsOnTheList(note.newValue)

    cy.deleteNote(note.newValue)
    cy.assertNoteDoesNotExistOnTheList(note.newValue)
  })
})
