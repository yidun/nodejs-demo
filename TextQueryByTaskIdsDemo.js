var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务文本检测结果获取接口地址
var apiurl="http://as.dun.163.com/v1/text/query/task";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
};

// 2.设置私有参数
var taskIds=["ecac3bc976674c36bfc5c06445243306","9fb210fa19a343f69b7e287912fa1ba6"];
post_data.taskIds=JSON.stringify(taskIds);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result=data.result;
		for(var i=0;i<result.length;i++){
			var obj=result[i];
			var action=obj.action;
			var taskId=obj.taskId;
			var status = obj.status;
			var callback=obj.callback;
			var labels=obj.labels;
			if(action==0){// 内容确认没问题，通过
				console.log("taskId="+taskId+"status="+status+"，callback="+callback+"，文本查询结果：通过")
			}else if(action==2){// 内容非法，不通过，需删除
				console.log("taskId="+taskId+"status="+status+"，callback="+callback+"，文本查询结果：不通过，分类信息如下："+JSON.stringify(labels))
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);