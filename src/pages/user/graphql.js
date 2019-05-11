import axios from 'axios';

export default {
    login,
    register,
    checkMail,
    checkName
}

function login (args) {
    const query = `
    mutation {
      data:
      userLogin(
       userId: "${args.name}",
       password: "${args.password}") {
         code,
         token,
         userId,
         avatar,
         nickname
       }
     }`;
      
    return axios.post('/graphql', {query})
}

function register (args) {
  const query = `
  mutation {
    data:
    userSave(
      userId: "${args.name}",
      password: "${args.password}",
      mail: "${args.mail}"
    ) {
      token,
      userId,
      avatar,
      nickname,
      code
    }
  }`;
  
  return axios.post('/graphql', {query})
}

function checkMail (args) {
  const query = `query {
    isExist:
    isMailNone(mail: "${args.mail}")}`;
    
  return axios.post('/graphql', {query});
}

function checkName (args) {
  const query = `query {
    isExist:
    isUserNone(userId: "${args.name}")}`;

  return axios.post('/graphql', {query})
}