import{ observable, action, computed, autorun } from 'mobx';
import axios from 'axios';

export default class Store {
    @observable user;
    @observable groupList;

    constructor() {
      this.user = {
        userId: '',
        nickname: '',
        avatar: '',
        token: ''
      };
      this.groupList = [];
    }

    // @computed ...


    // 获取登录状态
    @action async isLogin(){
      let user = JSON.parse(window.localStorage.getItem('user'));
      let result = false;
      if (user && user.token) {
        const query = `
        mutation {
          data:
          userVerify(userId: \"${user.userId}\",token: \"${user.token}\")
        }`;
          
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res === 1) {
            // 验证成功
            this.logIn(user);
            result = true;
          } else {
            this.logOut(user);
            result = false;
          }
        })
        .catch((err) => {
          console.log(err);
        })        
      }
      return result;
    }
    
    // 登录
    @action logIn(user){
      this.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    }
    
    // 注销
    @action logOut(){
      this.user = {
        userId: '',
        nickname: '',
        avatar: '',
        token: ''
      };
      window.localStorage.setItem('user', null);
    }


    // 获取用户拥有的团队
    @action async getGroup () {
      if (this.user.token) {
        const query = `
        query {
          data:
          groupEasy(userId: \"${this.user.userId}\",token: \"${this.user.token}\") {
            id,
            avatar,
            nickname
          }
        }`;
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res && res.length >= 0) {
            this.groupList = res;
            console.log('团队数据获取')
          } else {
            this.groupList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        this.groupList = [];
      } 
    }
 }