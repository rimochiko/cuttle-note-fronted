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
  
    // @action ...
    @action test() {
      console.log(1)
    }
    @action logIn(user){
      this.user = user;
    }
 }