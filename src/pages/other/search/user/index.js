import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link }  from 'react-router-dom';

let list = [{
    id: 'ddd',
    nickname: 'test',
    avatar: '',
  }, {
    id: 'ddd1',
    nickname: 'test',
    avatar: '',
  }, {
    id: 'ddd2',
    nickname: 'test',
    avatar: '',
  }];

class Page extends Component {
    constructor () {
        super();
    }

    generateItem (item) {
      return (
        <div className="search-item" key={item.id}>
          <div className="body">
            <img src={item.avatar ? `http://localhost:8080/static/user/${item.author.avatar}` :require('../../../../assets/images/default.jpg')}
                alt=""/>
            <Link to={`/article/user/${item.id}`} className="text">{item.nickname}</Link>
          </div>
          <div className="btns flex-row">
            <button><FontAwesomeIcon icon="plus"/>关注TA</button>
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