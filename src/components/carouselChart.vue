<template>
    <div class="showImg" >
    <!-- //轮播图片 -->
    <transition-group name="hello" appear>
    <img  @mouseover="changeInterval(true)" 
         @mouseleave="changeInterval(false)"  
         v-for="(item) in imgArr" 
         :key="item.id"
         :src="item.url" 
         alt="暂无图片" 
         v-show="item.id===currentIndex" 
         >
    </transition-group>
    <!-- //左侧按钮 -->
    <div  @click="clickIcon('up')"   class="iconDiv icon-left"> 
        <i class="el-icon-caret-left"></i>
    </div>
    <!-- //右侧按钮 -->
    <div  @click="clickIcon('down')"  class="iconDiv icon-right">
        <i class="el-icon-caret-right"></i>
    </div>
    <!-- //控制圆点 -->
    <div class="banner-circle">
        <ul>
            <li @click="changeImg(item.id)" 
                v-for="(item) in imgArr" 
                :key="item.id"
                :class="item.id===currentIndex? 'active': '' "
             ></li>
        </ul>
    </div>
</div>
</template>
  
  <script>
  export default {
    name: 'carouselChart',
    props: {
      
    },
    data(){
			return {
				currentIndex :0,//当前所在图片下标
				timer:null,//定时轮询
				imgArr:[
					{	id:0,
						url:"/login/logo.png",
					},{
						id:1,
						url:"/login/00117-1458793157.png",
					},{
						id:2,
						url:"/login/00268-3549298267.jpeg",
					},{
						id:3,
						url:"/login/QQ截图20230519133931.png",
					},
				]
			}
		},
		methods:{
			//开启定时器
			startInterval(){
				// 事件里定时器应该先清除在设置，防止多次点击直接生成多个定时器
				clearInterval(this.timer);
				this.timer = setInterval(()=>{
					this.currentIndex++;
					if(this.currentIndex > this.imgArr.length-1){
						this.currentIndex = 0
					}
				},5000)
			},
			// 点击左右箭头
			clickIcon(val){
				if(val==='down'){
					this.currentIndex++;
					if(this.currentIndex===this.imgArr.length){
						this.currentIndex = 0;
					}
				}else{
					/* 第一种写法
					this.currentIndex--;
					if(this.currentIndex < 0){
						this.currentIndex = this.imgArr.length-1;
					} */
					// 第二种写法
					if(this.currentIndex === 0){
						this.currentIndex = this.imgArr.length;
					}
					this.currentIndex--;
				}
			},
			// 点击控制圆点
			changeImg(index){
				this.currentIndex = index
			},
			//鼠标移入移出控制
			changeInterval(val){
				if(val){
					clearInterval(this.timer)
				}else{
					this.startInterval()
				}
			}
		},
		//进入页面后启动定时轮询
		mounted(){
			this.startInterval()
		}

  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  * {
	padding: 0;
	margin: 0;
}
/* 清除li前面的圆点 */
li {
	list-style-type: none;
}
.showImg{
	position: absolute;
	width: 40%;
	height: 250px;
	margin: 100px auto;
	overflow: hidden;
	left: 100px;
	top: -150px;
}
/* 轮播图片 */
.showImg img{
	width: 100%;
	height: 100%;
}

/* 箭头图标 */
.iconDiv{
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 30px;
	height: 30px;
	border: 1px solid #666;
	border-radius: 15px;
	background-color: rgba(125,125,125,.2);
	line-height: 30px;
	text-align: center;
	font-size: 25px;
	cursor: pointer;
}
.iconDiv:hover{
	background-color: white;
}
.icon-left{
	left: 10px;
}
.icon-right{
	right: 10px;
}

/* 控制圆点 */
.banner-circle{
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 20px;
}
.banner-circle ul{
	margin: 0 50px;
	height: 100%;
	text-align: right;
}
.banner-circle ul li{
	display: inline-block;
	width: 14px;
	height: 14px;
	margin: 0 5px;
	border-radius: 7px;
	background-color: rgba(125,125,125,.8);
	cursor: pointer;
}
.active{
	background-color: black !important; 
}

	/* 进入的起点、离开的终点
	.hello-enter{
		transform: translateX(-100%);
	}
	.hello-leave-to{
		transform: translateX(100%);
	} */
	@keyframes mySwitch{
       from{
		transform: translateX(-100%);
	   }
	   to{
		transform: translateX(0px);
	   }

	}
	.hello-enter-active{
		transition: mySwitch 0.5s linear;
	}
	.hello-leave-active{
		transition: mySwitch 0.5s linear reverse;
	}
	/* 进入的终点、离开的起点
	.hello-enter-to,.hello-leave{
		transform: translateX(0%);
	} */
	
</style>