describe('Admin tests', () => {

  const teachers = [
    {
      id: 1,
      lastName: "Test",
      firstName: "TEST",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      lastName: "Test2",
      firstName: "TEST2",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]

  it('Login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'Test',
        firstName: 'Test',
        lastName: 'TEST',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })

  it('create a session', () => {
    cy.intercept('GET', '/api/teacher', {
      body:
        teachers
    })

    cy.intercept('POST', '/api/session', {
      status: 200,

    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: "Test",
          date: new Date(),
          teacher_id: 1,
          description: "Test description",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]).as('session')

    cy.get('button[routerlink="create"]').click()

    cy.url().should('include', '/sessions/create')

    cy.get('input[formControlName=name]').type("Test")
    cy.get('input[formControlName=date]').type("2024-01-27")
    cy.get('mat-select[formControlName=teacher_id]').click().then(() => {
      cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('contain', teachers[0].firstName);
      cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text:contains(${teachers[0].firstName})`).first().click().then(() => {
        cy.get(`[formcontrolname=teacher_id]`).contains(teachers[0].firstName);})
    })
    cy.get('textarea[formControlName=description]').type("Test description")

    cy.get('button[type=submit]').click()

    cy.url().should('include', '/sessions')
  })

  it('Edit a session', () => {
    cy.intercept('GET', '/api/teacher', {
      body:
        teachers
    })

    cy.intercept('POST', '/api/session', {
      status: 200,

    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: "New Name",
          date: new Date(),
          teacher_id: 1,
          description: "Test description",
          users:[],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]).as('session')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: "Test",
        date: new Date(),
        teacher_id: 1,
        description: "Test description",
        users:[],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ).as('session')

    cy.intercept('PUT', '/api/session/1', {
      status: 200,

    })

    cy.get('button span').contains("Edit").click()

    cy.url().should('include', '/sessions/update/1')

    cy.get('input[formControlName=name]').clear()
    cy.get('input[formControlName=name]').type("Test")
    cy.get('button[type=submit]').click()

    cy.url().should('include', '/sessions')

  })

  it('Delete a session', () => {
    cy.intercept('GET', '/api/teacher', {
      body:
        teachers
    })

    cy.intercept('DELETE', '/api/session/1', {
      status: 200,

    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: "Test",
        date: new Date(),
        teacher_id: 1,
        description: "Test description",
        users:[],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ).as('session')

    cy.get('button span').contains("Detail").click()

    cy.url().should('include', '/sessions/detail/1')

    cy.get('button span').contains("Delete").click()

    cy.url().should('include', '/sessions')
  })

  it('Logout admin', () => {
    cy.get('span[class=link]').contains("Logout").click()

    cy.url().should('eq', 'http://localhost:4200/')
  })
  
});