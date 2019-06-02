import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link }  from 'react-router-dom';

class Page extends Component {
    generateLink (postId, userId, groupId) {
      let type = groupId ? "group" : "user";
      let space = groupId ? groupId : userId;
      return `/article/${type}/${space}/${postId}`;
    }

    generateItem (item) {
      console.log(item);
      return (
        <div className="search-item" key={item.id}>
          <div className="body">
            <Link className="title" to={this.generateLink(item.id, item.authorId, item.groupId)}>
              <div dangerouslySetInnerHTML={{__html: item.title}}></div>
            </Link>
            <p className="text" dangerouslySetInnerHTML={{__html: item.content}}></p>
          </div>
          <div className="author flex-row">  
            <div className="detail flex-row">
              <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` :require('../../../../assets/images/default.jpg')}
                    alt=""/>
              <Link to={`/article/user/${item.authorId}`} className="text">{item.authorName}</Link>
              {
                this.generateGroupLable(item.groupId, item.groupName)
              }
            </div>
            <p className="date">{item.date}</p>
          </div>
      </div>
      )
    }

    generateGroupLable (groupId, groupName) {
      if(groupId) {
        return (
          <Link to={`/article/group/${groupId}`} className="group-label">
              <FontAwesomeIcon icon="users"/>{groupName}
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