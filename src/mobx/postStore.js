import{ observable, action, computed, autorun } from 'mobx';
import axios from 'axios';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

export default class Store {
    @observable posts;
    @observable owner;

    constructor() {
      this.textPosts = [];
      this.imagePosts = [];
      this.textOwner = {};
      this.imageOwner = {};
    }

    // @computed ...


    // 获取文章列表
    @action async getTextPost(info, user) {
        let query;
        if (info.belongGroup) {
            query = `
                query {
                    data:
                    posts(
                        token: ${user.token},
                        userId: ${user.userId},
                        type: 0,
                        belongGroup: ${info.group}
                    )
                }`;
        } else {
            query = `
                query {
                    data:
                    posts(
                        token: ${user.token},
                        userId: ${user.userId},
                        type: 0,
                        author: ${info.author}
                    )
                }`;
        }
        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res && res.length >= 0) {
            // 验证成功
            this.textPosts = res;
            this.textOwner = user;
          } else {
            this.posts = [];
            this.textOwner = null;
          }
        })
        .catch((err) => {
          console.log(err);
        }) 
    }
    
    @action async getImagePost(info, user) {
        let query;
        if (info.belongGroup) {
            query = `
                query {
                    data:
                    posts(
                        token: ${user.token},
                        userId: ${user.userId},
                        type: 1,
                        belongGroup: ${info.group}
                    )
                }`;
        } else {
            query = `
                query {
                    data:
                    posts(
                        token: ${user.token},
                        userId: ${user.userId},
                        type: 1,
                        author: ${info.author}
                    )
                }`;
        }
        axios.post('/graphql', {query})
        .then(({data}) => {
          let res = data.data.data;
          if (res && res.length >= 0) {
            // 验证成功
            this.imagePosts = res;
            this.imageOwner = user;
          } else {
            this.imagePosts = [];
            this.imageOwner = null;
          }
        })
        .catch((err) => {
          console.log(err);
        }) 
    }
 }