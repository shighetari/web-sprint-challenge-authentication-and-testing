const request = require('supertest'); // calling it "request" is a common practice
const db = require('../database/dbConfig')
const server = require('../api/server'); // this is our first red, file doesn't exist yet
const { intersect } = require('../database/dbConfig');
const { set } = require('../api/server');
const { get } = require('../auth/auth-router');

describe('server', () => {
    it('runs the tests', () => {
        expect(true).toBe(true);
    })

    describe("GET / users end point in authRouter", function () {
        beforeEach(async () => {
            await db("users").truncate()
            await db('users').insert({ username: 'francisco', password: 'lol123' })
        })

        it("should respond with 200 OK", function () {
            return request(server)
                .get("/api/auth/users")
                .then(res => {
                    expect(res.status).toBe(200);
                });
        })

        it("should return an array of users", () => {
            return request(server)
                .get('/api/auth/users')
                .then(res => {
                    expect(res.body).toHaveLength(1)
                })
        })

        it("should respond with JSON", () => {
            return request(server)
                .get("/api/auth/users")
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                });
        });


    })
})

describe('POST / register users', () => {
    beforeEach(async () => {
        await db("users").truncate()
        await db('users').insert({ username: 'francisco', password: 'lol123' })
    })

    it('should create a new user', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ username: 'testingTheTests', password: 'serverspec' })
            .then(res => {
                return request(server)
                    .get('/api/auth/users')
                    .then(res => {
                        expect(res.body).toHaveLength(2)
                    })
            })
    })

    it('should respond with status 201 for created', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ username: 'Marta', password: 'lol123' }).then(res => {
                expect(res.status).toBe(201)
            })
    })

    it("should respond with JSON", () => {
        return request(server)
            .get("/api/auth/users")
            .then(res => {
                expect(res.type).toMatch(/json/i);
            });
    })

    it('should return back a message, user and token', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ username: 'testingTheTests', password: 'serverspec' })
            .then(res => {
                expect(res.body.token).toBeDefined()
            })
    })
})



describe('POST/ Login users', () => {
    beforeEach(async () => {
        await db("users").truncate()
    })

    it('should return a status 200', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ username: 'testingTheTests', password: 'serverspec' })
            .then(res => {
                return request(server)
                    .post('/api/auth/login')
                    .send({ username: 'testingTheTests', password: 'serverspec' })
                    .then(res => {
                        expect(res.status).toBe(200)
                    })
            })

    })

    it('should return back a message, user and token', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ username: 'testingTheTests', password: 'serverspec' })
            .then(res => {
                return request(server)
                    .post('/api/auth/login')
                    .send({ username: 'testingTheTests', password: 'serverspec' })
                    .then(res => {
                        expect(res.body.token).toBeDefined()
                        expect(res.body.message).toBe("Welcome to our API")
                        expect(res.body.user).toBeDefined()

                    })
            })
    })

    it("should respond with json (failure due to lack of body/creds)", () => {
        return request(server)
            .post("/api/auth/login")
            .send({ username: 'wrongcreds' })
            .then(res => {
                expect(res.type).toMatch(/json/i);
                expect(res.body.message).toBe('Invalid credentials')
            });
    })

    it('should respond with JSON on a successful test', () => {
        return request(server)
            .post("/api/auth/login")
            .then(res => {
                return request(server)
                    .post('/api/auth/register')
                    .send({ username: 'testingTheTests', password: 'serverspec' })
                    .then(res => {
                        return request(server)
                            .post('/api/auth/login')
                            .send({ username: 'testingTheTests', password: 'serverspec' })
                            .then(res => {
                                expect(res.body.message).toBe('Welcome to our API')
                            })
                    })
            })
    })
})

describe('GET / JOKES ROUTER', () => {
    beforeEach(async () => {
        await db("users").truncate()
        // await db('users').insert({ username: 'testingTheTests', password: 'serverspec' })

    })

    it('should respond with an 401 error if user isnt validated', () => {
        return request(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.status).toBe(401)
            })
    })

    it('should return back jokes', () => {
        return request(server)
            .post('/api/auth/register')
            .send({ username: 'testingTheTests', password: 'serverspec' })
            .then(res => {
                return request(server)
                    .post('/api/auth/login')
                    .send({ username: 'testingTheTests', password: 'serverspec' })
                    .then(res => {
                        // return req.body.token 
                        const token = res.body.token
                        var Header = { Authorization: token }
                        return request(server)
                            .get('/api/jokes')
                            .set(Header)
                            .then(res => {
                                expect(res.body).toHaveLength(20)
                            }) }) })  })
    it('should NOT return back jokes when NOT logged in', () => {
        return request(server)
        .get('/api/jokes')
        .then(res => {
            expect(res.status).toBe(401) //failing in the authentication
        })
    })

    it("should respond with JSON", () => {
        return request(server)
            .get("/api/jokes")
            .then(res => {
                expect(res.type).toMatch(/json/i);
            });
    })
})



//why wouldnt this work? - user was in DB but couldnt log in either here nor postman..

// it('should return back jokes', () => {
//     return request(server)
//         .post('/api/auth/login')
//         .send({ username: 'testingTheTests', password: 'serverspec' })
//         .then(res => {
//             // return req.body.token 
//             const token = res.body.token
//             var Header = { Authorization: token }
//             return request(server)
//                 .get('/api/jokes')
//                 .set(Header)
//                 .then( res => {
//                     expect(res.body).toHaveLength(20)
//                 })
//         })
// })