import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link }  from 'react-router-dom';

let list = [{
    id: 'ddd',
    nickname: 'test',
    avatar: '',
    createUser: {
      id: 'dddd',
      nickname: 'dddd'
    }
  }, {
    id: 'ddd1',
    nickname: 'test',
    avatar: '',
    createUser: {
      id: 'dddd',
      nickname: 'dddd'
    }
  }, {
    id: 'ddd2',
    nickname: 'test',
    avatar: '',
    createUser: {
      id: 'dddd',
      nickname: 'dddd'
    }
  }];

class Page extends Component {
    constructor () {
        super();
    }

    generateItem (item) {
      return (
        <div className="search-item" key={item.id}>
          <div className="body">
            <img src={item.avatar ? `http://localhost:8080/static/user/${item.author.avatar}` :require('../../../../assets/images/default_g.jpg')}
                alt=""/>
            <Link to={`/article/user/${item.id}`} className="text">{item.nickname}</Link>
            <p className="des"><FontAwesomeIcon icon="user-cog" title="创建人"/>
              <Link to={`/library/user/${item.createUser.id}`}>{item.createUser.nickname}</Link></p>
          </div>
          <div className="btns flex-row">
            <button><FontAwesomeIcon icon="plus"/>申请加入</button>
            <div className="links">
              <Link to={`/library/user/${item.id}`}><FontAwesomeIcon icon="book"/></Link>
              <Link to={`/library/user/${item.id}`}><FontAwesomeIcon icon="images" /></Link>
            </div>  
          </div>
      </div>
      )
    }

    render () {
        return (
          <div className="search-res search-user">
            {
              list && list.map((item) => {
                return this.generateItem(item)
              })
            }
          </div>
        );
    }
}

export default Page;