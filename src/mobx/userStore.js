import{ observable, action, computed, autorun } from 'mobx';
import axios from 'axios';

export default class Store {
    @observable user;
    @observable groupList;

    constructor() {
      this.user = {
        username: '',
        nickname: '',
        avatar: '',
        token: ''
      };
      this.groupList = [];
    }

    // @computed ...

    @action async isLogin(user){
      let user = JSON.parse(window.localStorage.getItem('user'));
      let res = false;
      if (user.token) {
        const query = `
        mutation {
          data:
          userVerify(username: \"${user.username}\",token: \"${user.token}\")
        }`;
          
        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          console.log(res);
          if (res === 1) {
            // 验证成功
            this.logIn(user);
            res = true;
          } else {
            this.logOut(user);
            res = false;
          }
        })
        .catch((err) => {
          console.log(err);
        })        
      }
      return res;
    }

    @action logIn(user){
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    }

    @action logOut(){
      this.user = {
        username: '',
        nickname: '',
        avatar: '',
        token: ''
      };
      window.localStorage.setItem('user', null);
    }
 }