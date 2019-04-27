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
          userVerify(userId: "${user.userId}",token: "${user.token}")
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
      this.user = {
        token: user.token,
        userId: user.userId,
        avatar: user.avatar ? `http://localhost:8080/static/${user.avatar}` : ''
      }
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
          groupMine(userId: "${this.user.userId}",token: "${this.user.token}") {
            code,
            group {
              id,
              avatar,
              nickname
            }
          }
        }`;
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 1) {
            let group = res.group;
            group.forEach((item) => {
              item.avatar = item.avatar ? `http://localhost:8080/static/group/${item.avatar}` : ''
            })
            this.groupList = res.group;
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