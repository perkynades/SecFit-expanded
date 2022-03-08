it('should be able to open view for programming exercise equipment', () => {
    cy.visit('http://localhost:9090/register.html')
    cy.get('input[name="username"]').type(makeid(6))
    cy.get('input[name="email"]').type(makeid(4) + '@net.no')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="password1"]').type('123')

    cy.get('#btn-create-account').click()

    cy.wait(2000).visit('http://localhost:9090/programexercise.html')

    cy.get('#three-t-midtbyen').children('div').click()

    cy.get('h5').contains('Running machine').parent().click()

    cy.get('h5').contains('Create program')
})

it('should be able to program exercise equipment', () => {
    cy.visit('http://localhost:9090/register.html')
    cy.get('input[name="username"]').type(makeid(6))
    cy.get('input[name="email"]').type(makeid(4) + '@net.no')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="password1"]').type('123')

    cy.get('#btn-create-account').click()

    cy.wait(2000).visit('http://localhost:9090/programexercise.html')

    cy.get('#three-t-midtbyen').children('div').click()

    cy.get('h5').contains('Running machine').parent().click()

    cy.get('select[name="terrainGroup"]').select('Mountains')
    cy.get('input[name="length"]').type(128)
    cy.get('input[name="speed"]').type(10)
    cy.get('input[type="button"]').click()

    cy.get('h5').contains('Mountains')
    cy.get('p').contains('Length: 128km | Speed: 10km/h')
})

it('should be able to start an programmed exercise equipment', () => {
    cy.visit('http://localhost:9090/register.html')
    cy.get('input[name="username"]').type(makeid(6))
    cy.get('input[name="email"]').type(makeid(4) + '@net.no')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="password1"]').type('123')

    cy.get('#btn-create-account').click()

    cy.wait(2000).visit('http://localhost:9090/programexercise.html')

    cy.get('#three-t-midtbyen').children('div').click()

    cy.get('h5').contains('Running machine').parent().click()

    cy.get('select[name="terrainGroup"]').select('Mountains')
    cy.get('input[name="length"]').type(128)
    cy.get('input[name="speed"]').type(10)
    cy.get('input[type="button"]').click()

    cy.get('h5').contains('Mountains').parent().parent().get('#btn-start-exercise').click()
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}