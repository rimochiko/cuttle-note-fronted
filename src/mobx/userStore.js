import{ observable, action, computed, autorun } from 'mobx';

export default class Store {
    @observable user;

    constructor() {
      this.user = {
        username: '',
        nickname: '',
        avatar: '',
        token: ''
      };
    }

    // @computed ...
    @action logIn(user){
      this.user = user;
      console.log('user:');
      console.log(user);
      window.localStorage.setItem('user', JSON.stringify(user));
    }
 }