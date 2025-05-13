const request = require('supertest');
const app = require('../app')

describe('users', () => {
    var token = ""
    var id = ""
    var code = ""
    it('should register a user' , async () => {
        const response = await request(app)
            .post('/api/auth/register' )
            .send({"email": "user25@test.com","password": "HolaMundo.01"})
            .set('Accept', 'application/json' )
            .expect(200)
        expect(response.body.user.email).toEqual('user25@test.com')
        expect(response.body.user.role).toEqual('usuario')
        token = response.body.token
        id = response.body.user._id
        code = parseInt(response.body.user.validationCode, 10);
    })

    it('should validate the user by validationCode', async () => {
        const response = await request(app)
            .post('/api/auth/validation')  
            .send({"code": code})  
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.email).toEqual('user25@test.com');
        expect(response.body.validated).toEqual(true);
        expect(response.body._id).toEqual(id);
         
    token = response.body.token;
    id = response.body._id;
    });

    it('should sign in with the user ', async () => {
        const response = await request(app)
            .post('/api/auth/login')  
            .send({"email": "user25@test.com","password": "HolaMundo.01"})
            .set('Accept', 'application/json')
            .expect(200);

        token = response.body.token;
        id = response.body.user._id;

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(id).toBeDefined();
        
    });

    it('should get the users' , async () => {
        const response = await request(app)
            .get('/api/users')
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json' )
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(response.body.some(u => u.email === 'user25@test.com')).toBe(true);

        
    });

    it('should delete a user' , async () => {
        const response = await request(app)
            .delete('/api/users/' + id)
            .auth(token, { type: 'bearer' })
            .set('Accept', 'application/json' )
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(response.status).toBe(200);
    })
})