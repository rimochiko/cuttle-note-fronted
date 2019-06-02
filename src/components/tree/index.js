import React, {Component} from 'react';
import { NavLink, Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss';

class Tree extends Component {
    constructor () {
        super();
        this.state = {
            data: [],
            activeId: null
        }
        this.toggleTree = this.toggleTree.bind(this);
        this.generateIcon = this.generateIcon.bind(this);
        this.loopTreeUl = this.loopTreeUl.bind(this);
        this.isNodeEmpty = this.isNodeEmpty.bind(this);
        this.generateLink = this.generateLink.bind(this);
    }

    componentWillUpdate (nextProps) {
        if (nextProps.owner !== this.props.owner || nextProps.data !== this.props.data) {
            let data = nextProps.data.slice(),
                activeId = parseInt(nextProps.activeId);
            let flat = [], i, len;
            
            this.initTreeData(data, flat, activeId);

            for(i = 0, len = flat.length; i < len; i++ ) {
                if (flat[i].id === activeId) {
                    break;
                }
            }
            flat.length = i + 1;
            if(activeId) {
                this.calOpenData(flat, true);
            }
            this.setState({
                data: data,
                activeId: activeId
            }); 
        }             
    }

    calOpenData (data, isContinue) {
        if(!isContinue || !data || data.length <= 0 || !data[data.length-1])
        return;

        let length = data.length;
        let parentId = data[length - 1].parentId;
        let i = 0;

        for(; i < length; i++) {
            if (data[i].id === parentId) {
                break;
            }
        }
        if (i < length) {
            data[i].isOpen = true;
            data.length = i + 1;
        }
        
        if (!(data[i] && data[i].parentId)) {
            isContinue = false;
        }
        this.calOpenData(data, isContinue);
    }

    initTreeData (arr, flat, activeId) {
        if (!arr || arr.length <= 0) {
            return;
        }
        let ownerId = this.props.owner.id,
            ownerType = this.props.owner.type,
            ownerName = this.props.owner.name,
            base = this.props.base;
        arr.forEach((item) => {
            item.isOpen = false;
            item.link = `/${base}/${ownerType}/${ownerId}/${item.id}`
            if (ownerType === "group") {
                item.groupId = ownerId
                item.groupName = ownerName
            }
            if(activeId && item) {
                flat.push(item);
            }
            this.initTreeData(item.children, flat, activeId);
        })
    }

    /**
     * 折叠树形目录
     * */
    toggleTree (e, item) {
        if (this.isNodeEmpty(item.children)) {
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
                <NavLink to={item.link}><img src={item.img} className="link-img" alt=""/>{item.name}</NavLink>
            )
        } else {
            return (
                <NavLink to={item.link} activeClassName="active">{item.title}</NavLink>
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
                    <Link className="btn-add" 
                          to={{
                            pathname: '/article/edit',
                            query: {
                                parentId: item.id,
                                groupId: item.groupId || null,
                                groupName: item.groupName || null
                            }
                          }}>+</Link>
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
            let childData = item.status !== 0 ? this.loopTreeUl(item.children, item.isOpen, level+1) : '';
            let itemIcon = this.generateIcon(item, this.isNodeEmpty(item.children));
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
        let treeMenu = this.loopTreeUl(this.state.data, true, 0);
        return (
            <div className="mck-wrapper-tree">
                { treeMenu }
            </div>
        );
    }
}

export default Tree;