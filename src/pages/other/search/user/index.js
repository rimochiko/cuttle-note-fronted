import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link }  from 'react-router-dom';

class Page extends Component {
    constructor () {
        super();
    }

    generateItem (item) {
      return (
        <div className="search-item" key={item.id}>
          <div className="body">
            <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` :require('../../../../assets/images/default.jpg')}
                alt=""/>
            <Link to={`/article/user/${item.id}`} className="text">{item.nickname}</Link>
            <span className="des">ID：{item.id}</span>
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
              this.props.list && this.props.list.map((item) => {
                return this.generateItem(item)
              })
            }
          </div>
        );
    }
}

export default Page;