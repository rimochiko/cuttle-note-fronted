import React, {Component} from 'react';
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss';

class DropDown extends Component {
    constructor () {
        super();
    }

    /**
     * 折叠树形目录
     * */
    toggleTree (e) {
        let clickedNode = e.target.parentNode;
        let childTree = clickedNode.previousElementSibling;
        console.log(childTree);
        return false;
    }
    
    /**
     * 生成目录节点图标
     * */
    generateIcon (item, isEmpty) {
        if (isEmpty) {
        return (
            <FontAwesomeIcon icon="circle" className="tree-icon-child" onClick={toggleTree}/>
        );
        } else {
        return item.isOpen ? (
            <FontAwesomeIcon icon="caret-down" className="tree-icon-parent" onClick={toggleTree}/>
        ) : (
            <FontAwesomeIcon icon="caret-right" className="tree-icon-parent" onClick={toggleTree}/>
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
        if (isNodeEmpty(treeData)) return; 
        return treeData.map((item, index) => {
        let childData = loopTreeUl(item.child);
        let itemIcon = generateIcon(item, isNodeEmpty(item.child));
        return (
            <ul className="component-tree-list" key={item.id} style={{display: (item.isOpen ? "block" : "none")}}>
            <li className="component-tree-item" key={item.id}>
                <div className="component-tree-btn">
                    {itemIcon}
                    <Link to={item.link}>{item.name}</Link>
                </div>
                { childData }
            </li>
            </ul>
        );
        });
    }
    

    render () {
        let treeMenu = loopTreeUl(this.props.data);
        console.log(treeMenu);
        return (
            <div className="mck-wrapper-tree">
                { treeMenu }
            </div>
        );
    }
}

export default DropDown;