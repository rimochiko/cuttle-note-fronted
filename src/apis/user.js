export default {
    base: 'http://localhost:8080/graphql',
    register: {
        url: ''
    },
    login: {
        url: ''
    },
    checkMail: {
        name: 'isExist',
        func: 'isMailNone',
        args: ['mail']
    },
    checkName: {
        name: 'isExist',
        func: 'isUserNone',
        args: ['username']
    }
}