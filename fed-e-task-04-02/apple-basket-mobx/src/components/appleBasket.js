import React, { Component } from 'react';
import AppleList from './appleList';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class AppleBasket extends Component {
  render () {
    const { pickApple, numberOfLeftover, numberOfEaten, weightOfLeftover, eatenWeight, isPicking } = this.props.store;

    return (
      <div className="appleBasket">
        <div className="title">苹果篮子</div>
        <div className="stats">
          <div className="section">
            <div className="head">当前</div>
            <div className="content">{ numberOfLeftover }个苹果，{ weightOfLeftover }克</div>
          </div>
          <div className="section">
            <div className="head">已吃掉</div>
            <div className="content">{ numberOfEaten }个苹果，{ eatenWeight }克</div>
          </div>
        </div>
        <div className="appleList">
          <AppleList />
        </div>
        <div className="btn-div">
          <button className={isPicking ? 'disabled' : ''} onClick={ pickApple }>采集</button>
        </div>
      </div>
    );
  }
}

export default AppleBasket;