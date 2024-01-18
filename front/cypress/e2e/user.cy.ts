describe('User session spec', () => {

    it('Login successfull', () => {
      let sessionUsers: Number[] = [];
      cy.visit('/login')
  
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: false
        },
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
            users: [],
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
          users: sessionUsers,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ).as('session')
  
      cy.get('input[formControlName=email]').type("yoga@studio.com")
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
  
      cy.url().should('include', '/sessions')
    })
  
    it('Account details', () => {
      let sessionUsers: Number[] = [];
  
      cy.intercept(
        {
          method: 'GET',
          url: '/api/user/1',
        },
        {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          email: "test@mail.com",
          admin: false,
          password: "password",
          createdAt: new Date(),
          updatedAt: new Date()
  
        },
      ).as('user')
  
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
            users: [],
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
          users: sessionUsers,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ).as('session')
  
      cy.get('span[routerLink=me]').click().then(()=>{
        cy.url().should('include', '/me').then(()=>{
          cy.get('p').contains("Name: firstName "+("lastName").toUpperCase())
          cy.get('p').contains("Email: test@mail.com")
        })
      })
      cy.get('button').first().click()
      cy.url().should('include', '/sessions')
  
      cy.get('button span').contains("Detail").click()
      cy.url().should('include', '/sessions/detail/1')
    })
  
    it('Participate to a session', () => {
      
      let sessionUsers: Number[] = [1];
  
      cy.intercept('GET', '/api/teacher/1', {
        body:
          {
            id: 1,
            lastName: "Test",
            firstName: "TEST",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
      })
  
      cy.intercept('POST', '/api/session/1/participate/1', {
        status: 200,
  
      })
  
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
          users: sessionUsers,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ).as('session')
  
  
      cy.get('h1').contains("Test").then(()=>{
        sessionUsers.push(1)
        cy.get('button span').contains("Participate").click().then(()=>{
          cy.wait(500)
          cy.get('button span').contains('Do not participate')
          cy.get('span[class=ml1]').contains("1 attendees")
        })
      })
    })
  
    it('Do not participate to a session', () => {
      cy.intercept('GET', '/api/teacher', {
        body:
          [
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
      })
  
      cy.intercept('DELETE', '/api/session/1/participate/1', {
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
          users: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ).as('session')
  
      cy.get('button span').contains("Do not participate").click()
      cy.get('span[class=ml1]').contains("0 attendees")
    })
  
    it('Logout successful', () => {
      cy.get('span[class=link]').contains("Logout").click()
  
      cy.url().should('eq', 'http://localhost:4200/')
    })
  });