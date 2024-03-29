import{ observable, action} from 'mobx';
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
      this.infoNum = 0;
      this.fans = [];
      this.follows = [];
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
          userVerify(userId: "${user.userId}",token: "${user.token}") {
            code,
            msg
          }
        }`;
          
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let response = data.data.data;
          if (response.code === 0) {
            // 验证成功
            let obj = {
              token: user.token,
              userId: user.userId,
              nickname: user.nickname,
              avatar: user.avatar ? user.avatar: ''
            }
            this.logIn(obj);
            result = true;
          } else {
            this.logOut();
            result = false;
          }
        })
        .catch((err) => {
          console.log(err);
        }) 
        await this.getRelations()
        await this.getUnreadNum()
      }
      return result;
    }
    
    /**
     * 更新昵称、头像
     */
    @action updateProfile(newUser) {
      let user = JSON.parse(window.localStorage.getItem('user'));
      if(newUser.nickname) {
        user.nickname = newUser.nickname;
      }
      
      if(newUser.avatar) {
        user.avatar = newUser.avatar;
      }
      this.logIn(user);
    }
    
    // 登录
    @action logIn(user){
      let res = {
        token: user.token,
        userId: user.userId,
        nickname: user.nickname,
        avatar: user.avatar && user.avatar.search(/^http:\/\//) === -1 ? `http://localhost:8080/static/user/${user.avatar}` : user.avatar
      }
      this.user = res;
      window.localStorage.setItem('user', JSON.stringify(res));
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
    
    // 获取用户粉丝和关注
    @action async getRelations () {
      if (this.user.token) {
        const query = `
        query {
          fans:
          userFans(userId: "${this.user.userId}")  {
            code,
            msg,
            result {
                id,
                nickname,
                avatar
            }
          },
          follow:
          userFollow(userId: "${this.user.userId}")  {
            code,
            msg,
            result {
              id,
              nickname,
              avatar
            }
          }
        }
        `;
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let fans = data.data.fans,
              follows = data.data.follow;
          
          this.fans = fans.code === 0 ? fans.result : [];
          this.follows = follows.code === 0? follows.result : [];
        })
        .catch((err) => {
          console.log(err);
        })
      }
    }

    // 获取用户未读消息数据
    @action async getUnreadNum () {
      if (this.user.token) {
        const query = `
          query {
            data:
            getUnreadCount (userId: "${this.user.userId}",token: "${this.user.token}") {
              code,
              msg,
              result
            }
          }
        `;
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          this.infoNum = res.code === 0 ? res.result : 0;
        })
        .catch((err) => {
          console.log(err);
        })
      }
    }


    // 获取用户拥有的团队
    @action async getGroup () {
      if (this.user.token) {
        const query = `
        query {
          data:
          groupMine(userId: "${this.user.userId}",token: "${this.user.token}") {
            code,
            msg,
            result{
              id,
              avatar,
              nickname,
              role
            }
          }
        }`;
        await axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res.code === 0) {
            let group = res.result || [];
            group.forEach((item) => {
              item.avatar = item.avatar ? `http://localhost:8080/static/group/${item.avatar}` : ''
            })
            this.groupList = group;
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