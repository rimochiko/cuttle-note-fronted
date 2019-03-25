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
    }

    /**
     * 折叠树形目录
     * */
    toggleTree (e, item) {
        let clickedNode = e.target;
        let findCount = 0;
        while (clickedNode.tagName !== 'div' && clickedNode.className !== 'component-tree-btn') {
            clickedNode = clickedNode.parentNode;
            findCount++;
            if (findCount > 3) {
                return false;
            } 
        }
        let childTree = clickedNode.nextElementSibling;
        //console.log(childTree, item);
        return false;
    }
    
    /**
     * 生成目录节点图标
     * */
    generateIcon (item, isEmpty) {
        //console.log("item");
        //console.log(item);
        if (isEmpty) {
        return (
            <FontAwesomeIcon icon="circle" className="tree-icon-child" onClick={(e, item) => {this.toggleTree(e, item)}}/>
        );
        } else {
        return item.isOpen ? (
            <FontAwesomeIcon icon="caret-down" className="tree-icon-parent" onClick={(e, item) => {this.toggleTree(e, item)}}/>
        ) : (
            <FontAwesomeIcon icon="caret-right" className="tree-icon-parent" onClick={(e, item) => {this.toggleTree(e, item)}}/>
        );
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
    loopTreeUl (treeData) {
        if (this.isNodeEmpty(treeData)) return; 
        return treeData.map((item, index) => {
            let childData = this.loopTreeUl(item.child);
            let itemIcon = this.generateIcon(item, this.isNodeEmpty(item.child));
            return (
                <ul className="component-tree-list" key={item.id} style={{display: (item.isOpen ? "block" : "none")}}>
                <li className="component-tree-item" key={item.id}>
                    <div className="component-tree-btn">
                        <div className="btn-main">{itemIcon}
                        <Link to={item.link}>{item.name}</Link></div>
                        <div className="btn-add">+</div>
                    </div>
                    { childData }
                </li>
                </ul>
            );
        });
    }
    

    render () {
        let treeMenu = this.loopTreeUl(this.props.data);
        console.log(treeMenu);
        return (
            <div className="mck-wrapper-tree">
                { treeMenu }
            </div>
        );
    }
}

export default Tree;