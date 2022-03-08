describe('Register page boundary tests', () => {
  it('should be bound to lower range', () => {
    cy.visit('http://localhost:9090/register.html')

    cy.get('#btn-create-account').click()

    cy.get('li').contains('username').children('ul').children('li').contains('This field may not be blank.')
    cy.get('li').contains('password').children('ul').children('li').contains('This field may not be blank.')
    cy.get('li').contains('password1').children('ul').children('li').contains('This field may not be blank.')
  })

  it('should be bound to upper range', () => {
    cy.visit('http://localhost:9090/register.html')
    cy.get('input[name="username"]').type('l0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimit')
    cy.get('input[name="email"]').type('emil@soidhgoisdgoisdgoisdjoidsjgsdijgsdijgsoijgsiojgsijdisjgjiodsgjisgoijasdasdasdasdasdasdasdasasasdsad.no')
    cy.get('input[name="password"]').type('helloDello')
    cy.get('input[name="password1"]').type('radadiiiiii')
    cy.get('input[name="phone_number"]').type('l0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimit')
    cy.get('input[name="country"]').type('l0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimit')
    cy.get('input[name="city"]').type('l0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimit')
    cy.get('input[name="street_address"]').type('l0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimitl0o0llimit')

    cy.get('#btn-create-account').click()

    //cy.get('li').contains('email').children('ul').children('li').contains('Enter a valid email address.')
    cy.get('li').contains('username').children('ul').children('li').contains('Ensure this field has no more than 150 characters.')
    cy.get('li').contains('password').children('ul').children('li').contains('Passwords does not match')
    cy.get('li').contains('phone_number').children('ul').children('li').contains('Ensure this field has no more than 50 characters.')
    cy.get('li').contains('country').children('ul').children('li').contains('Ensure this field has no more than 50 characters.')
    cy.get('li').contains('city').children('ul').children('li').contains('Ensure this field has no more than 50 characters.')
    cy.get('li').contains('street_address').children('ul').children('li').contains('Ensure this field has no more than 50 characters.')
  })
})

describe('Register page 2-way domain tests', () => {
  it('should accept email on both correct email and is string', () => {
    cy.visit('http://localhost:9090/register.html')

    let correctEmailString = makeid(4) + '@ntnu.no'

    cy.get('input[name="username"]').type(makeid(4)+'eIsNice')
    cy.get('input[name="email"]').type(correctEmailString)
    cy.get('input[name="password"]').type('helloDello')
    cy.get('input[name="password1"]').type('helloDello')

    cy.get('#btn-create-account').click()

    cy.wait(2000).location('pathname').should('eq', '/workouts.html')
  })

  it('should accept matching passwords that are strings', () => {
    cy.visit('http://localhost:9090/register.html')

    let password = 'nicePassBr0'
    let password1 = password

    cy.get('input[name="username"]').type(makeid(4)+'eIsNice')
    cy.get('input[name="email"]').type(makeid(4) + '@ntnu.no')
    cy.get('input[name="password"]').type(password)
    cy.get('input[name="password1"]').type(password1)

    cy.get('#btn-create-account').click()

    cy.wait(2000).location('pathname').should('eq', '/workouts.html')
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
