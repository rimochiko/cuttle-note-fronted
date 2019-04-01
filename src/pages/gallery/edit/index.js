import React, {Component} from 'react';
import './index.scss';
import Sidebar from '../../../layouts/sidebar/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../components/modal';
import { Link } from 'react-router-dom';

class Page extends Component {
    constructor () {
        super();
    }


    render () {
        return (
          <div className="page">
          <Sidebar />
            <div className="flex-row overflow flex-1">
            


            <div className="edit-page flex-1">
              <div className="edit-header">
                <input type="text" placeholder="输入文章标题" className="title"/>
                <div className="edit-tool">
                  <ul className="ul-tool">
                   
                  </ul>
                  <ul className="ul-tool">
                    
                  </ul>
                </div>
              </div>
              <div className="edit-body" contentEditable ref="editBox">
                
              </div>
              <div className="edit-footer">
                <p>最近一次保存 2019年3月1日 11:00</p>
                <div className="btns-box">
                  <button className="radius-btn input-btn">保存到草稿箱</button>
                  <button className="radius-btn input-btn">发布</button>
                </div>
              </div>
            </div>
            
              <div className="flex-column edit-side">
                <div className="edit-menu">
                  <h1 className="section-title">文章目录</h1>
                  <div className="detail">
                    <Link to="/">我的空间</Link> / <Link to="/">笔记</Link> / <Link to="/">2019-01-23</Link>
                    <span><FontAwesomeIcon icon="edit"/></span>  
                  </div>
                </div>
                <div className="edit-tags">
                  <h1 className="section-title">标签</h1>
                  <ul className="tag">
                    <li><a href="#">+ 添加</a></li>
                  </ul>
                </div>
              </div>
                
            </div>
          </div>
        );
    }
}

export default Page;