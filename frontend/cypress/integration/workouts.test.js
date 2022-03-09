describe('Black box system tests', () => {
    it('should be able to view all details on workouts', () => {
        let username = makeid(6)
        
        cy.visit('http://localhost:9090/register.html')
        cy.get('input[name="username"]').type(username)
        cy.get('input[name="email"]').type(makeid(4) + '@net.no')
        cy.get('input[name="password"]').type('123')
        cy.get('input[name="password1"]').type('123')

        cy.get('#btn-create-account').click()

        cy.wait(2000).get('#btn-create-workout').click()

        // Fill out workout form
        cy.wait(1000).get('input[name="name"]').type('Super workout')
        cy.get('input[name="date"]').click().then(input => {
            input[0].dispatchEvent(new Event('input', { bubbles: true }))
            input.val('2022-04-30T13:10')
        }).click()
        cy.get('textarea[name="notes"]').type('Some very insightfull notes')

        // Fill out exercise form in workout
        cy.get('select[name="type"]').select("1")
        cy.get('input[name="sets"]').type(3)
        cy.get('input[name="number"]').type(10)
        cy.get('#btn-add-exercise').click()

        cy.get('#btn-ok-workout').click()

        cy.wait(2000).get('h5').contains('Super workout')
        cy.get('td').contains('4/30/2022')
        cy.get('td').contains('1:10:00 PM')
        cy.get('td').contains(username).parent().parent().parent().parent().parent().click()

        cy.wait(1000).get('input[name="name"]').should('have.value', "Super workout")
        cy.get('input[name="date"]').should('have.value', "2022-04-30T13:10:00")
        cy.get('input[name="owner_username"]').should('have.value', username)
        cy.get('select[name="visibility"]').should('have.value', "PU")
        cy.get('textarea[name="notes"]').should('have.value', 'Some very insightfull notes')
        cy.get('input[name="files"]').should('have.value', '')

        cy.get('#inputExerciseType0').should('have.value', "1")
        cy.get('input[name="sets"]').should('have.value', 3)
        cy.get('input[name="number"]').should('have.value', 10)

        cy.get('#comment-area').type('Great workout bro!')

        cy.get('#post-comment').click()
        
        cy.wait(1000).get('strong').should('contain', username)
        cy.get('p').should('contain', 'Great workout bro!')
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
