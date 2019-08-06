mui.init({
	swipeBack: true //启用右滑关闭功能
});
var controls = document.getElementById("segmentedControls");
var contents = document.getElementById("segmentedControlContents");
$j('#segmentedControlContents').scroll(function() {
	var scrll_ght = $j(this).scrollTop()
	console.log(scrll_ght)
	if(scrll_ght < 0) {
		$j("body").css('margin-top', '-' + scrll_ght + 'px');
		var yi_k = 5 - scrll_ght
		$j(".mui-fullscreen ").css('top', yi_k + 'px');

	} else {
		$j(".mui-fullscreen ").css('top', 5+ 'px');
	}
})
for(var i = 0; i < $j('#segmentedControls li').length; i++) {
	$j('#segmentedControls li').eq(i).attr('data-index', i)
	$j('.mui-control-content').eq(i).attr('id', i)
}

//默认选中第一个
controls.querySelector('li').classList.add('active');
//			contents.querySelector('.mui-control-content').classList.add('mui-active');
(function() {
	var controlsElem = document.getElementById("segmentedControls");
	var contentsElem = document.getElementById("segmentedControlContents");
	var controlListElem = controlsElem.querySelectorAll('li');
	var contentListElem = contentsElem.querySelectorAll('dl');
	var controlWrapperElem = controlsElem.parentNode;
	var controlWrapperHeight = controlWrapperElem.offsetHeight;
	var controlMaxScroll = controlWrapperElem.scrollHeight - controlWrapperHeight; //左侧类别最大可滚动高度
	var maxScroll = contentsElem.scrollHeight - contentsElem.offsetHeight; //右侧内容最大可滚动高度
	var controlHeight = controlListElem[0].offsetHeight; //左侧类别每一项的高度
	var controlTops = []; //存储control的scrollTop值
	var contentTops = [0]; //存储content的scrollTop值
	var length = contentListElem.length;
	for(var i = 0; i < length; i++) {
		controlTops.push(controlListElem[i].offsetTop + controlHeight);
	}
	for(var i = 1; i < length; i++) {
		var offsetTop = contentListElem[i].offsetTop;
		if(offsetTop + 100 >= maxScroll) {
			var height = Math.max(offsetTop + 100 - maxScroll, 100);
			var totalHeight = 0;
			var heights = [];
			for(var j = i; j < length; j++) {
				var offsetHeight = contentListElem[j].offsetHeight;
				totalHeight += offsetHeight;
				heights.push(totalHeight);
			}
			for(var m = 0, len = heights.length; m < len; m++) {
				contentTops.push(parseInt(maxScroll - (height - heights[m] / totalHeight * height)));
			}
			break;
		} else {
			contentTops.push(parseInt(offsetTop));
		}
	}
	contentsElem.addEventListener('scroll', function() {
		var scrollTop = contentsElem.scrollTop;
		for(var i = 0; i < length; i++) {
			var offsetTop = contentTops[i];
			var offset = Math.abs(offsetTop - scrollTop);
			//						console.log("i:"+i+",scrollTop:"+scrollTop+",offsetTop:"+offsetTop+",offset:"+offset);
			if(scrollTop < offsetTop) {
				if(scrollTop >= maxScroll) {
					onScroll(length - 1);
				} else {
					onScroll(i - 1);
				}
				break;
			} else if(offset < 20) {
				onScroll(i);
				break;
			} else if(scrollTop >= maxScroll) {
				onScroll(length - 1);
				break;
			}
		}
	});
	var lastIndex = 0;
	//监听content滚动
	var onScroll = function(index) {
		if(lastIndex !== index) {
			lastIndex = index;
			var lastActiveElem = controlsElem.querySelector('.active');
			lastActiveElem && (lastActiveElem.classList.remove('active'));
			var currentElem = controlsElem.querySelector('li:nth-child(' + (index + 1) + ')');
			currentElem.classList.add('active');
			//简单处理左侧分类滚动，要么滚动到底，要么滚动到顶
			var controlScrollTop = controlWrapperElem.scrollTop;
			if(controlScrollTop + controlWrapperHeight < controlTops[index]) {
				controlWrapperElem.scrollTop = controlMaxScroll;
			} else if(controlScrollTop > controlTops[index] - controlHeight) {
				controlWrapperElem.scrollTop = 0;
			}
		}
	};
	//滚动到指定content
	var scrollTo = function(index) {
		contentsElem.scrollTop = contentTops[index];
	};
	mui(controlsElem).on('tap', 'li', function(e) {
		scrollTo(this.getAttribute('data-index'));
		return false;
	});
})();