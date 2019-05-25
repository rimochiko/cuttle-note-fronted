import React, {Component} from 'react';
import Modal from '../../../../../components/modal';
import Tabs from '../../../../../components/tabs';

const TabPane = Tabs.TabPane;
class ImageModal extends Component {
    constructor () {
        super();
        this.state = {
            imgSrcBase: '',
            imgSrcText: '',
            imgSrcTip: ''
        }
    }

    toggle () {
        this.refs.insert.toggle()
    }

    judgeTempAvatar (e) {
        if (!e.target.files && e.target.files[0]) {
            return;
        }
        let file = e.target.files[0],
        reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            let tag="base64,",
                base64 = event.target.result,
                baseStr = base64.substring(base64.indexOf(tag) + tag.length);
            let eqTagIndex=baseStr.indexOf("=");
                baseStr=eqTagIndex!=-1?baseStr.substring(0,eqTagIndex):baseStr;
            let strLen=baseStr.length;
            let fileSize=(strLen-(strLen/8)*2)/1024;
            if(fileSize >= 1024) {
                this.props.showTip("图片不能超过1M");
                e.target.value = '';
                return;
            }
            this.setState({
                imgSrcBase: base64,
                imgSrcText: file.name,
                imgSrcTip: ''
            })
        }
    }

    insertUploadImage () {
        if (!this.state.imgSrcBase) {
          this.props.showTip("上传图片不能为空");
          return;
        }
  
        // 上传图片
        this.props.sendData({
          token: this.props.userStore.user.token,
          userId: this.props.userStore.user.userId,
          imgbase: this.state.imgSrcBase
        })
        .then(({data}) => {
          let res =data.data.data;
          console.log(res);
          if (res.code === 1) {
            this.setState({
              imgSrc: res.url
            })
            this.props.getResult({url: `http://localhost:8080/static/article/${this.state.imgSrc}`, alt: this.state.imgSrcText})
            this.refs.insert.toggle();
          } else {
            this.props.showTip("上传图片出错");
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }

      insertDirectImage () {
        if (this.state.imgSrc.search(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/) < 0) {
          this.props.showTip("图片地址格式错误")
          return;
        }
        this.props.getResult({url: this.state.imgSrc, alt: this.state.imgSrcText})
        this.refs.insert.toggle();
      }

    render () {
        return (
            <Modal title="添加图片" ref="insert">
                <div className="edit-link-body">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="本地上传" key="1">
                            <div className="input-group">
                            <label>选择图片</label>
                            <div className="img-file-upload">
                                <input type="file" 
                                        className="real-upload"
                                        onChange={this.judgeTempAvatar.bind(this)}/>
                                <div className="info-upload">{this.state.imgSrcText || '点击选取图片'}</div>
                            </div>
                            </div>
                            <div className="input-group">
                            <label>图片描述</label>
                            <input type="text" 
                                placeholder="输入图片描述"
                                onChange={(e) => {
                                this.setState({
                                imgName: e.target.value
                                })
                            }}/>
                            </div>
                            <div className="input-group">
                            <button className="radius-btn input-btn"
                                    onClick={this.insertUploadImage.bind(this)}>上传并插入图片</button>
                            </div>
                        </TabPane>
                        <TabPane tab="网络获取" key="2">
                            <div className="input-group">
                            <label>图片地址</label>
                            <input type="text" 
                                placeholder="http://"
                                onChange={(e) => {
                                    this.setState({
                                        imgSrc: e.target.value
                                    })
                            }}/>
                            </div>
                            <div className="input-group">
                            <label>图片描述</label>
                            <input type="text"
                                placeholder="输入图片描述" 
                            />
                            </div>
                            <div className="input-group">
                            <button className="radius-btn input-btn"
                                    onClick={this.insertDirectImage.bind(this)}>确定添加</button>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>   
            </Modal>
        )
    }
}

export default ImageModal;