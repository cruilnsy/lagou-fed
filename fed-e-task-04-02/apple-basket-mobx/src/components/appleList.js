import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class AppleList extends Component {
  render () {
    const { eatApple, leftoverApples } = this.props.store;

    return (
      <div>
      { leftoverApples.map((apple, index) => (
        <div className="appleItem" key={apple.id}>
          <div className="apple">
            <img src={require('../images/apple.png')} alt="" />
          </div>
          <div className="info">
            <div className="name">红苹果 - {apple.id}号</div>
            <div className="weight">{apple.weight}克</div>
          </div>
          <div className="btn-div">
            <button onClick={() => eatApple(apple.id)}> 吃掉 </button>
          </div>
        </div>
      ))}
      </div>
    );
  }
}

export default AppleList;