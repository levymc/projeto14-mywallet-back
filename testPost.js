import axios from 'axios'

axios.post('http://localhost:5000/login', {email: "levymcruz@gmail.com", senha: "123"}).then(res => {
    console.log(res.data)
}).catch(err => {
    console.log(err)
})

// axios.post('http://localhost:5000/cadastro', {nome: "levy",email: "levaymcruz@gmail.com", senha: "123"}).then(res => {
//     console.log(res.data)
// }).catch(err => {
//     console.log(err)
// })