import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link }  from 'react-router-dom';

class Page extends Component {

    generateItem (item) {
      return (
        <div className="search-item" key={item.id}>
          <div className="body">
            <Link className="title" to="/">{item.post.id}</Link>
            <p className="text">{item.post.content}</p>
          </div>
          <div className="author flex-row">  
            <div className="detail flex-row">
              <img src={item.author.avatar ? `http://localhost:8080/static/user/${item.author.avatar}` :require('../../../../assets/images/default.jpg')}
                    alt=""/>
              <Link to={`/article/user/${item.author.id}`} className="text">{item.author.nickname}</Link>
              {
                this.generateGroupLable(item.group)
              }
            </div>
            <p className="date">{item.post.date}</p>
          </div>
      </div>
      )
    }

    generateGroupLable (group) {
      if(group) {
        return (
          <Link to={`/article/group/${group.id}`} className="group-label">
              <FontAwesomeIcon icon="users"/>{group.nickname}
          </Link>
        )
      }
    }

    render () {
        return (
          <div className="search-res search-article">
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