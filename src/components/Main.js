require('normalize.css/normalize.css');
require('styles/App.scss');

// 获取图片相关的数据
var imgData = require('../model/imgData.json');

import React from 'react';

// 利用匿名函数自执行，得到图片路径
imgData =(function getImgURL(imgArr){
	for(let i in imgArr){
		var singleImgData = imgArr[i];
		singleImgData.imgURL = require('../images/'+singleImgData.imgURL);
		imgArr[i] = singleImgData;
	}

	return imgArr;
})(imgData);


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
      	<section className="img-sec">
      	</section>
      	<nav className="controller-nav">
      	</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
