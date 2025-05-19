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
        token = response.body.token
        code = response.body.user.validationCode

    })

    it('should validate the user by validationCode', async () => {
        const response = await request(app)
            .post('/api/auth/validation')  
            .send({"code": code})  
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.user.validated).toEqual(true);
         
    });

    it('should sign in with the user ', async () => {
        const response = await request(app)
            .post('/api/auth/login')  
            .send({"email": "user25@test.com","password": "HolaMundo.01"})
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
        expect(response.body.user._id).toBeDefined();

        token = response.body.token;

    });

    it('should recover password, should get a new validationcode' , async () => {
        const response = await request(app)
            .post('/api/auth/recovery')  
            .send({"email": "user25@test.com"})
            .set('Accept', 'application/json')
            .expect(200);

        token = response.body.token;
        code = response.body.code;

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(code).toBeDefined();
        expect(typeof code).toBe('number');
    })

    it('should validate with recovery code', async () => {
        const response = await request(app)
            .post('/api/auth/validation')  
            .send({"code": code})  
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        
        expect(response.body.user.validated).toEqual(true);
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
        token = response.body.token;
    });

    it('should change the password' , async () => {
        const response = await request(app)
            .patch('/api/auth/newpassword')  
            .send({"newPassword1": "HolaMundo.02", "newPassword2": "HolaMundo.02"})  
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.message).toEqual('Contraseña actualizada');
    });

    it('should sign in with the new password ', async () => {
        const response = await request(app)
            .post('/api/auth/login')  
            .send({"email": "user25@test.com","password": "HolaMundo.02"})
            .set('Accept', 'application/json')
            .expect(200);

        token = response.body.token;
        id = response.body.user._id;

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(id).toBeDefined();
        
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