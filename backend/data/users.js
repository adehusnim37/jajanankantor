import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'perdanasarjana@gmail.com',
        password: bcrypt.hashSync('1234567',10),
        isAdmin:true
    },
    {
        name: 'Ade Husni M',
        email: 'user@perdanasarjana.com',
        password: bcrypt.hashSync('1234567',10)
    },
    {
        name:'Jane Doe',
        email:'jane@example.com',
        password:bcrypt.hashSync('123456',10),
    },
]

export default users