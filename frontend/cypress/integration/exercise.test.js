describe('Exercise page boundary tests', () => {
    it('should be bound to lower range when not authenticated', () => {
        cy.visit('http://localhost:9090/exercise.html')

        cy.get('#btn-ok-exercise').click()

        cy.get('li').contains('Authentication credentials were not provided.')
    })

    it('should be bound to lower range', () => {
        // Get authenticed
        cy.visit('http://localhost:9090/register.html')
        cy.get('input[name="username"]').type(makeid(6))
        cy.get('input[name="email"]').type(makeid(4) + '@net.no')
        cy.get('input[name="password"]').type('123')
        cy.get('input[name="password1"]').type('123')

        cy.get('#btn-create-account').click()

        cy.wait(2000).visit('http://localhost:9090/exercise.html')

        // Do boundary tests as authenticated user
        cy.get('#btn-ok-exercise').click()

        cy.get('li').contains('duration').children('ul').children('li').contains('A valid integer is required.')
        cy.get('li').contains('calories').children('ul').children('li').contains('A valid integer is required.')
        cy.get('li').contains('unit').children('ul').children('li').contains('This field may not be blank')

        cy.get('input[name="duration"]').type(-1449037)
        cy.get('input[name="calories"]').type(-1449037)

        cy.get('#btn-ok-exercise').click()

        cy.get('li').contains('duration').children('ul').children('li').contains('A valid integer is required.')
        cy.get('li').contains('calories').children('ul').children('li').contains('A valid integer is required.')
    })

    it('should be bound to upper range', () => {
        // Authenticate
        cy.visit('http://localhost:9090/register.html')
        cy.get('input[name="username"]').type(makeid(6))
        cy.get('input[name="email"]').type(makeid(4) + '@net.no')
        cy.get('input[name="password"]').type('123')
        cy.get('input[name="password1"]').type('123')

        cy.get('#btn-create-account').click()

        cy.wait(2000).visit('http://localhost:9090/exercise.html')

        // Do boundary tests as authenticated user
        cy.get('input[name="duration"]').type(214748364722234234234234234234214748364722234234234234234234)
        cy.get('input[name="calories"]').type(214748364722234234234234234444214748364722234234234234234234)
        cy.get('input[name="unit"]').type("unitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunitunit")
        cy.get('#btn-ok-exercise').click()

        cy.get('li').contains('duration').children('ul').children('li').contains('A valid integer is required.')
        cy.get('li').contains('calories').children('ul').children('li').contains('A valid integer is required.')
        cy.get('li').contains('unit').children('ul').children('li').contains('Ensure this field has no more than 50 characters.')
    })
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