require('normalize.css/normalize.css');
require('styles/App.scss');

// 获取图片相关的数据
var imgData = require('../model/imgData.json');

import React from 'react';
import ReactDOM from 'react-dom';

// 利用匿名函数自执行，得到图片路径
imgData =(function getImgURL(imgArr){
	for(let i in imgArr){
		var singleImgData = imgArr[i];
		singleImgData.imgURL = require('../images/'+singleImgData.imgURL);
		imgArr[i] = singleImgData;
	}

	return imgArr;
})(imgData);


var ImgFigure = React.createClass({
	render(){
		// console.log(this.props);

		var styles = {};

		if(this.props.arrange.pos){
			styles = this.props.arrange.pos;
		}
		return(
			<figure className="img-figure" style={styles}>
				<img src={this.props.data.imgURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>

		)
	}
})

function getRangeRandom(low,high) {
	return Math.ceil(Math.random() * (high - low) + low);
}


class AppComponent extends React.Component {

	// 这里不可以用getInitialState(){}来声明状态，
	// getInitialState是React.createClass({})中参数对象的方法
	// 这里使用的是React.Component,
	// 所以要用constructor
	constructor(props){
		super(props);
		this.state={
			imgsArrangeArr:[
				/*{
					pos:{
						left:'0',
						top:'0'
					}
				}*/
			]
		}

	}

	Constant={
		centerPos:{
			left:0,right:0
		},
		hPosRange:{	//水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{//垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	}

	/*
		重新布局所有图片
		指定居中图片的index

	*/
	rearrange(centerIndex){
		console.log(centerIndex);
		var imgsArrangeArr = this.state.imgsArrangeArr,
		Constant = this.Constant,
		centerPos = Constant.centerPos,
		hPosRange = Constant.hPosRange,
		vPosRange = Constant.vPosRange,
		hPosRangeLeftSecX = hPosRange.leftSecX,
		hPosRangeRightSecX = hPosRange.rightSecX,
		hPosRangeY = hPosRange.y,
		vPosRangeY = vPosRange.topY,
		vPosRangeX = vPosRange.x,

		imgsArrangeTopArr = [],
		topImgNum = Math.ceil( Math.random() * 2),//取一个或者不取
		topImgSpliceIndex = 0,

		// 首先居中centerIndex 图片
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
		imgsArrangeCenterArr[0].pos = centerPos;

		// 取出要布局上侧的图片的状态信息
		topImgSpliceIndex = Math.ceil( (Math.random() * (imgsArrangeArr.length - topImgNum)) );

		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach((value,index)=>{
			imgsArrangeTopArr[index].pos = {
				top: getRangeRandom(vPosRangeY[0],vPosRangeY[1]),
				left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
			};
		})

		// 布局左右两侧的图片
		for(var i = 0, j = imgsArrangeArr.length , k = j/2;i < j; i++){
			var hPosRangeLorR = null;
			// 前半部分布局在左，右半部分布局在右
			if(i<k){
				hPosRangeLorR = hPosRangeLeftSecX;
			}else{
				hPosRangeLorR = hPosRangeRightSecX;
			}

			imgsArrangeArr[i].pos = {
				top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				left:getRangeRandom(hPosRangeLorR[0],hPosRangeLorR[1])
			}
		}

		if(imgsArrangeArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr:imgsArrangeArr
		});

	}

	componentDidMount(){

		// 获取舞台大小

		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);

		// 获取imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW/2),
			halfImgH = Math.ceil(imgH/2);


		// 计算中线图片的位置
		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		}

		// 计算上册区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW -  halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfImgW - imgW;
		this.Constant.vPosRange.x[1] = halfImgW;


		// 计算周围图片的位置

		this.rearrange(0);


	}

	render() {
		
		var controllerUnits = [],imgFigures=[];

		imgData.forEach((value,index)=>{
			// 这里的this指向问题？是因为ES6新特性？
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:'0',top:'0'
					}
				}
			}
			imgFigures.push(<ImgFigure arrange={this.state.imgsArrangeArr[index]} key={index} data={value} ref={'imgFigure'+index}/>);

	
		});
		
		// console.log(this.state.imgsArrangeArr);
	    return (
	      	<section className="stage" ref={'stage'}>
		      	<section className="img-sec">
		      		{imgFigures}
		      	</section>
		      	<nav className="controller-nav">
		      		{controllerUnits}
		      	</nav>
	      	</section>
	    );
	}
}


export default AppComponent;
