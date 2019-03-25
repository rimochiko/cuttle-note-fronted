import React, {Component} from 'react';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom';

class Page extends Component {
    constructor () {
        super();
    }

    render () {
        return (
          <div className="flex-scroll-y">
            <div className="article">
                <div className="header">
                  <ul className="tag">
                    <li><a href="#">未完结</a></li>
                  </ul>
                  <h1 className="title">我如何零基础转行成为一个自信的前端</h1>
                  <div className="detail">
                    <p>
                      <span>创建人：<Link to="/">Seris</Link></span>
                      <span>创建日期：2019-03-19</span>
                    </p>
                    <p>
                      <span><FontAwesomeIcon icon="info-circle"/></span>
                      <span><FontAwesomeIcon icon="pen"/></span>
                      <span><FontAwesomeIcon icon="trash-alt"/></span>
                    </p>
                  </div>
                </div>
                <div className="body">
                  <div className="content">
                    <blockquote><p>这篇文章去年10月8号发过，后来因为一些 drama 删掉了。这次重发，是因为我想把这篇文章发到知乎，在我发到知乎之前，还是先发回掘金。我对掘金很有感情的。仅为此，不是为了炒冷饭，不求赞，不求关注。</p>
                    </blockquote>
                    <p>这个大言不惭的标题源自我与我所认识的前端从业者的比较，也源自别人的评价。读者也可以看我其它文章，评估我的专业能力。当然我不是在每个领域都能匹配别人三年的实践经验（原标题是学前端一年学三年的知识，后来觉得不妥就改了）。我还有很多技术栈没掌握，比如没写过小程序，没用过 jQuery（这个也不想再学了，只是依然还有用人单位在要求）。也有很多坑没踩过，比如没有做过浏览器兼容（说实话也不太想兼容 IE，浪费生命）。我想说的是我对 JS 这门语言以及 CS 这门学科掌握的深度，前端生态圈理解和熟悉的程度，以及知识迁移能力。</p>
                    <p>我不是想炫耀自己多牛，而是想帮助和我有相似背景的人。我在掘金发了几篇文章后，有几个朋友在知道我零基础学编程一年半就进步这么快后，想知道我是怎么学的。这篇文章就是对他们的详细回答。</p>
                    <h2>一，背景介绍</h2>
                    <p>我本科学的是国际贸易，乱选的专业。毕业后做了半年外贸，实在不喜欢，然后去做英文编辑了。第二份工作也很无聊，就是写英文软文，发表在国外的行业期刊上，给公司做广告。然后也做英文官网的内容。这是一个很没创意的工作。每天写几篇我自己都没感觉的文章，不知道价值在哪。最重要的是，这份职业里我找不到持续精进的方向，做一年和做三年好像区别不大。</p>
                    <p>后来学前端也是误打误撞。因为我同时在做英文官网的内容和产品，会和前端打交道。当时公司的前端是学 UI 转过来的，我观察他的工作，以为就是 HTML 写个页面结构，然后 CSS 做个样式，然后用 JS 做点效果就可以了。这个简单啊，我也可以做。然后我就裸辞去学习前端开发了…… 后来发现我错了，但是自己跳的坑，流着泪也要爬出来。接下来我经历了人生中最难熬的一段时间，也经历了人生中第一次大的转变。</p>
                  </div>
                  <div className="extra">
                    <ul className="extra-ul">
                      <li><FontAwesomeIcon icon={["far","eye"]}></FontAwesomeIcon> 11</li>
                      <li><FontAwesomeIcon icon={["far","thumbs-up"]}></FontAwesomeIcon> 0</li>
                    </ul>
                    <ul className="extra-ul">
                      <li><FontAwesomeIcon icon={["far", "star"]}></FontAwesomeIcon> 收藏</li>
                      <li><FontAwesomeIcon icon="share-alt"></FontAwesomeIcon> 分享</li>
                    </ul>
                  </div>
                </div>
                

                <div className="comments">
                  <h1 className="section-title">我要评论</h1>
                  <div className="input-comment-box">
                    <textarea className="input-textarea"></textarea>
                    <div className="input-btn-box">
                      <input type="submit" text="提交" className="input-btn radius-btn"/>
                    </div>
                  </div>

                  <div className="list-comment-box">
                    <h1 className="section-title">全部评论（3）</h1>
                    <ul className="ul-comment-single">
                      <li className="li-comment-single">
                        <img src={require('../../../assets/images/avatar1.jpg')} />
                        <div class="author-comment"> 
                          <Link to="/">小爱公主</Link>：
                          vue2.x采用Object.defineProperty()实现数据劫持，但是并不能劫持到数组长度变化等，是通过创建一个数组的继承类来重写pop()、push()等方法来实现对数组监听的。
                          <span className="date"> 2019/3/18</span>
                        </div>
                        <span className="btn-reply">回复</span>
                      </li>
                      <li className="li-comment-single">
                        <img src={require('../../../assets/images/avatar2.jpg')} />
                        <div class="author-comment">
                          <Link to="/">小葵</Link>：
                          冲呀！！投票走起！！
                          <span className="date"> 2019/3/18</span>
                        </div>
                        <span className="btn-reply">回复</span>
                      </li>
                      <li className="li-comment-single">
                        <img src={require('../../../assets/images/avatar1.jpg')} />
                        <div class="author-comment">
                          <Link to="/">小爱公主</Link> 回复 <Link to="/">小葵</Link>：
                          样式优先级那一块，内嵌、链接和导入，应该是在最后的优先级最高。
                          <span className="date"> 2019/3/18</span>
                        </div>
                        <span className="btn-reply">回复</span>
                      </li>
                    </ul>
                  </div>
                </div>
            </div>
          </div>     
        );
    }
}

export default Page;