const db = require('../database/dbConfig')

module.exports = {
    register,
    login,
    findById,
    findAllUsers
};

function register(newUser) {
    return db('users')
        .insert(newUser, 'id')
        .then(([id]) => {
            return findById(id)
        })
}


function login(username) {
    return db('users')
        .where(username)
        .select('users.id', 'users.username', 'users.password')
        .orderBy('users.id')
}
function findById(id) {
    return db('users')
        .where({ id })
        .first()
        .select('users.id', 'users.username')
}
function findAllUsers() {
    return db('users')
        .select('users.id', 'users.username')
        .orderBy('users.id')
}
