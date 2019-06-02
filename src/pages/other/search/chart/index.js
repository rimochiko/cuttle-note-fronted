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
      return (
        <div className="search-item search-chart" key={item.id}>
          <div className="body">
            <Link className="title" to={this.generateLink(item.id, item.authorId, item.groupId)}>{item.title}</Link>
            <img src={item.url ? item.url : "http://localhost:8080/static/chart/9d59bd026f22eefd6b0b941f3387e91b.png"}
                 alt=""
                 className="cover"/>
          </div>
          <div className="author flex-row">  
            <div className="detail flex-row">
              <img src={item.avatar ? `http://localhost:8080/static/user/${item.avatar}` :require('../../../../assets/images/default.jpg')}
                    alt=""/>
              <Link to={`/article/user/${item.authorId}`} className="text">{item.authorName}</Link>
              {
                this.generateGroupLable({id:item.groupId, nickname: item.groupName})
              }
            </div>
            <p className="date">{item.date}</p>
          </div>
      </div>
      )
    }

    generateGroupLable (group) {
      if(group.id) {
        return (
          <Link to={`/article/group/${group.id}`} className="group-label">
              <FontAwesomeIcon icon="users"/>{group.nickname}
          </Link>
        )
      }
    }

    render () {
        return (
          <div className="search-res search-chart">
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