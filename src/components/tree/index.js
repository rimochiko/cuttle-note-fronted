import React, {Component} from 'react';
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss';

class Tree extends Component {
    constructor () {
        super();
        this.toggleTree = this.toggleTree.bind(this);
        this.generateIcon = this.generateIcon.bind(this);
        this.loopTreeUl = this.loopTreeUl.bind(this);
        this.isNodeEmpty = this.isNodeEmpty.bind(this);
        this.generateLink = this.generateLink.bind(this)
    }

    /**
     * 折叠树形目录
     * */
    toggleTree (e, item) {
        if (this.isNodeEmpty(item.child)) {
            return false;
        }
        item.isOpen = !item.isOpen;
        this.forceUpdate();
    }
    
    /**
     * 生成目录节点图标
     * */
    generateIcon (item, isEmpty) {
        let id = item;
        if (isEmpty) {
        return (
            <div className="toggle-btn" onClick={(e, item) => {this.toggleTree(e, id)}}>
                <FontAwesomeIcon icon="circle" className="tree-icon-child"/>
            </div>
        );
        } else {
        return item.isOpen ? (
            <div className="toggle-btn" onClick={(e, item) => {this.toggleTree(e, id)}}>
                <FontAwesomeIcon icon="caret-down" className="tree-icon-parent"/>
            </div>
            
        ) : (
            <div className="toggle-btn" onClick={(e, item) => {this.toggleTree(e, id)}}>
                <FontAwesomeIcon icon="caret-right" className="tree-icon-parent"/>
            </div>
            
        );
        }
    }

    /**
     * 生成目录链接
     *  */
    generateLink (item, hasImg) {
        if (hasImg) {
            return (
                <Link to={this.props.base + item.link}><img src={item.img} className="link-img"/>{item.name}</Link>
            )
        } else {
            return (
                <Link to={this.props.base + item.link}>{item.name}</Link>
            )
        }
    }
    
    /**
     * 生成创建按钮
     */
    generateAddBtn (item, level) {
        if (item.status === 0) {
            return (
                <span className="tip-text">草稿</span>
            )
        } else {
            if (level < 5) {
                return (
                    <Link className="btn-add" to="/article/edit">+</Link>
                )
            } else {
                return (<span></span>);
            }
        }
    }
    
    /**
     * 判断节点是否为空
     * */
    isNodeEmpty (item) {
        if (!item) return true;
        if (item.length === 0) return true;
        return false;  
    }
    
    
    /**
     * 生成树列表
     * */
    loopTreeUl (treeData,isOpen, level) {
        if (this.isNodeEmpty(treeData)) return; 
        return treeData.map((item) => {
            let childData = item.status !== 0 ? this.loopTreeUl(item.child, item.isOpen, level+1) : '';
            let itemIcon = this.generateIcon(item, this.isNodeEmpty(item.child));
            let itemLink = this.generateLink(item, item.img&&item.img.length > 0)
            let itemAdd = this.generateAddBtn(item, level);
            return (
                <ul className="component-tree-list" key={item.id} style={{display: (isOpen ? "block" : "none")}}>
                    <li className="component-tree-item" key={item.id}>
                        <div className="component-tree-btn" style={{paddingLeft: 32 + level*10 + 'px'}}>
                            <div className="btn-main">{itemIcon}
                                {itemLink}
                            </div>
                            { itemAdd }
                        </div>
                        { childData }
                    </li>
                </ul>
            );
        });
    }
    

    render () {
        let treeMenu = this.loopTreeUl(this.props.data, true, 0);
        return (
            <div className="mck-wrapper-tree">
                { treeMenu }
            </div>
        );
    }
}

export default Tree;