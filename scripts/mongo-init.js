// Script de inicialización de MongoDB
// Crea colecciones con índices

db = db.getSiblingDB('reparto-gastos');

// Colección de grupos
db.createCollection('groups');
db.groups.createIndex({ name: 1 }, { unique: true });

// Colección de gastos
db.createCollection('expenses');
db.expenses.createIndex({ groupId: 1 });
db.expenses.createIndex({ groupId: 1, createdAt: -1 });

// Colección de usuarios
db.createCollection('users');
db.users.createIndex({ groupId: 1 });

console.log('Base de datos "reparto-gastos" inicializada correctamente');
