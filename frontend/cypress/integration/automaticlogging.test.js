it('should be able to view fitness centers', () => {
    cy.visit('http://localhost:9090/register.html')
    cy.get('input[name="username"]').type(makeid(6))
    cy.get('input[name="email"]').type(makeid(4) + '@net.no')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="password1"]').type('123')

    cy.get('#btn-create-account').click()

    cy.wait(2000).visit('http://localhost:9090/automaticloggers.html')

    cy.get('#btn-add-logger').click()

    cy.get('h3').contains('Pick fitness center')
})

it('should be able to view exercise equipment', () => {
    cy.visit('http://localhost:9090/register.html')
    cy.get('input[name="username"]').type(makeid(6))
    cy.get('input[name="email"]').type(makeid(4) + '@net.no')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="password1"]').type('123')

    cy.get('#btn-create-account').click()

    cy.wait(2000).visit('http://localhost:9090/automaticloggers.html')

    cy.get('#btn-add-logger').click()

    cy.get('#sit-gloes').children('div').click()

    cy.get('h3').contains('Pick exercise equipment')
    cy.get('div').contains('Sit Gløshaugen idrettsbygg')
})

it('should be able to map exercise to exericse equipment', () => {
    cy.visit('http://localhost:9090/register.html')
    cy.get('input[name="username"]').type(makeid(6))
    cy.get('input[name="email"]').type(makeid(4) + '@net.no')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="password1"]').type('123')

    cy.get('#btn-create-account').click()

    cy.wait(2000).visit('http://localhost:9090/automaticloggers.html')

    cy.get('#btn-add-logger').click()

    cy.get('#sit-gloes').children('div').click()

    cy.wait(2000).get('div').contains('Sit Gløshaugen idrettsbygg')
    cy.get('h6').contains('Wide grip bench press').parent().click()

    cy.wait(2000).location('pathname').should('eq', '/automaticloggers.html')

    cy.get('h5').contains('Sit Gløshaugen idrettsbygg')
    cy.get('p').contains('Wide grip bench press')
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