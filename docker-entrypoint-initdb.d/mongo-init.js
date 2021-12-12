print('Start ###################');

db = db.getSiblingDB('genesis-books');
db.createUser({
    user: 'admin',
    pwd: 'password',
    roles: [{ role: 'readWrite', db: 'genesis-books' }],
});
db.createCollection('users');

print('End #####################');