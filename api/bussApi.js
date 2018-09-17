import config from './lwconfig';

import {_post} from "./HttpFecth"
import {createTopicSol} from "./subchainclient.js"
import {createSubTopicSol} from "./subchainclient.js"
import {voteOnTopic} from "./subchainclient.js"
import {autoCheckSol} from "./subchainclient.js"
//import { resolveCname } from 'dns';


var topicIndex = config.topicIndex;
var subTopicIndex = config.subTopicIndex;
var url = "http://" + config.rpcIp + ":" + config.port + "/rpc";
var userAddr = config.userAddr;
var subChainAddr = config.subChainAddr;
var chain3 = new Chain3(new Chain3.providers.HttpProvider(config.vnodeIp));
var ip = config.rpcIp;
var port = config.port;
var packPerBlockTime = config.packPerBlockTime;   // 子链出块时间单位s
var decimals = config.decimals;   // 子链token精度
var mc = chain3.mc;

const Bytes2HexString = (b)=> {
  let hexs = "";
  for (let i = 0; i < b.length; i++) {
      let hex = (b[i]).toString(16);
      if (hex.length === 1) {
          hexs = '0' + hex;
      }
      hexs += hex.toUpperCase();
  }
  return hexs;
}
//-----------16进制string转换成bytes32----------//
const Hexstring2btye = (str)=> {
  let pos = 0;
  let len = str.length;
  if (len % 2 != 0) {
      return null;
  }
  len /= 2;
  let hexA = new Array();
  for (let i = 0; i < len; i++) {
      let s = str.substr(pos, 2);
      let v = parseInt(s, 16);
      hexA.push(v);
      pos += 2;
  }
  return hexA;
}

export var getContractInfo = function(url, methodName, postParam) {
    var data = {"jsonrpc": "2.0", "id": 0, "method": methodName, "params": postParam};
    //data = JSON.stringify(data);

    return new Promise(function(resolve, reject){
        _post(url, data).then((datas) => {
            //console.log("datas---------" + JSON.stringify(datas))
            var rpcResult;
            if (datas.result == undefined) {
                rpcResult == "have exception";
            }
            else if (datas.result.Storage == undefined) {
                rpcResult = datas.result;
            } else{
                rpcResult = datas.result.Storage;
            }
		    resolve(rpcResult);
        }); 

    });
     
};

var t = Date.now();  
function sleep(d){  
    while(Date.now() - t <= d);  
}

// 创建问题    yes
export var createTopic = function (award, desc, duration, userAddr) {
  
  return new Promise((resolve, reject) => {
    try{
    var result = {};
    
      var postParam1 = {"SubChainAddr": subChainAddr, "Sender": userAddr};
      // _post(url, postParam1).then((datas) => {
          //     console.log(datas.result);

          // })
      getContractInfo(url, "ScsRPCMethod.GetNonce", postParam1).then(function(nonce){
              
        // 创建问题
        
        createTopicSol(award, duration, desc, subChainAddr, nonce);
        
              
        // 获取hash
        var postParam2 = {
            "SubChainAddr": subChainAddr,
            "Sender": userAddr, 
            "nonce": nonce
        };
        // 十秒打包区块，返回hash
        // t = Date.now();
        // sleep((packPerBlockTime + 3) * 1000);

        t = Date.now();
        sleep((packPerBlockTime + 2) * 1000);
        
        getContractInfo(url, "ScsRPCMethod.GetTxRlt", postParam2).then(function(topicHash){
          
              result.topicHash = "0x" + topicHash;
              result.isSuccess = 1;
              resolve(result);
        });
      
        
      });
    } catch (e) {
      console.log("创建问题时发生异常-----" + e);
      result.topicHash = "";
      result.isSuccess = 0;
      reject(result);
    }
  });
  
	
}


// 问题列表   yes
// 1 获取个数  2 循环查找mapping下标  3 根据下标查找topic   4 组装list返回	
export var getTopicList = function (pageNum, pageSize) {
	// 先获取个数
  return new Promise((resolve, reject) => {
    // 获取topic个数
    var postParam1 = {
      "SubChainAddr": subChainAddr,
      "Request": [
        {
          "Reqtype":0,
          "Storagekey": [],
          "Position": [],
          "Structformat": []
        }
      ]
    };
    getContractInfo(url,
      "ScsRPCMethod.GetContractInfo",
      postParam1
    ).then((allInfoResult) => {
      var topicNum = allInfoResult["000000000000000000000000000000000000000000000000000000000000000a"];
      topicNum = parseInt(topicNum, 16);
      //console.log("topic个数是：-------" + parseInt(topicNum, 16));
      
      // 获取topic mapping 下标
      var topicArr = [];
      var flag = 0;
  
      // 挨个处理topic
      for (var i = 0; i < topicNum; i++) {   // parseInt(topicNum)
        var postParam2 = {
          "SubChainAddr": subChainAddr,
          "Request": [
            {
              "Reqtype":1,
              "Storagekey": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
              "Position": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,i]
              
            }
          ]
        };
        getContractInfo(url,
          "ScsRPCMethod.GetContractInfo",
          postParam2
        ).then(function(keyResult){     // 获取mapping的下标，topicHash
        	//console.log(keyResult);   // { c65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a8: 'a08562daa0eebe69de3cf291896162513e1d11fddc24b5c3066a31a6c1006c68e5' }
          for (var k in keyResult) {     // 只会循环一次
            var key = keyResult[k].substring(2);   // 开头a0舍去  topicHash
            // 根据下标查找topic
            var postParam3 = {
              "SubChainAddr": subChainAddr,
              "Request": [
                {
                  "Reqtype": 2,
                  "Storagekey": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
                    "Position": Hexstring2btye(key),
                  "Structformat": [51,49,51,49,49,49,51,49,51,49]
                  
                }
              ]
            };
            getContractInfo(url,"ScsRPCMethod.GetContractInfo", postParam3).then(function(topicResult){
            	//console.log(topicResult);
            	var topic = {};
            	var str = chain3.sha3(key + topicIndex, {"encoding": "hex"}).substring(2);
            	var prefixStr = str.substring(0, str.length - 2);
            	var suffixStr = str.substring(str.length - 2, str.length);
            	var suffixInt = parseInt(suffixStr, 16);
              // console.log(str);
              // console.log(suffixInt);
              // console.log(prefixStr + converHex(suffixInt + 3));
              // console.log(topicResult);
              var topicHash = '0x' + key;
              // if (topicHash == "a017fb1d3c998918e6b065398946015865726a9469489b8fd0232b33bf2e823ae2") {
              //   console.log(topicResult);
              //   console.log(prefixStr + converHex(suffixInt + 1));
              //   console.log(prefixStr + converHex(suffixInt + 3)); 
              // }
              var owner = '0x' + topicResult[prefixStr + converHex(suffixInt + 1)];
              
            	var award = topicResult[prefixStr + converHex(suffixInt + 3)]; 
            	var duration = parseInt(topicResult[prefixStr + converHex(suffixInt + 4)], 16) * packPerBlockTime
            	
            	topic.topicHash = topicHash; 
              topic.owner = owner; 
              //console.log(topicHash + "--------" + award);

            	topic.award = chain3.toDecimal('0x' + award.substring(2)) / Math.pow(10, decimals);;
            	topic.duration = duration;
            	
            	
            	var descFlag = topicResult[prefixStr + converHex(suffixInt + 2)];
            	if (descFlag.length < 7) {
            		  // 长string, 这里代表长度，需要连接
                  var descStr = chain3.sha3(prefixStr + converHex(suffixInt + 2), 
                  {"encoding": "hex"}).substring(2);  // 再做一次hash获取字符串第一部分的key
                  var prefixStr = descStr.substring(0, descStr.length - 2);
                  var suffixStr = descStr.substring(descStr.length - 2, descStr.length);
                  var suffixInt = parseInt(suffixStr, 16);
                  var owner = topicResult[prefixStr + converHex(suffixInt + 1)]; 
                  var valueArr = [];
                  var descStr = "";
                  for (var k in topicResult) {
                    if (k.indexOf(prefixStr) >= 0) {
                      descStr = descStr + topicResult[k].substring(2);
                    }
                  }
                	
                	var blankIndex = descStr.indexOf('0000');
                  if (blankIndex > 0) {
                    topic.desc = chain3.toAscii(descStr.substring(0, blankIndex)); // 问题内容
                  } else {
                    topic.desc = chain3.toAscii(descStr);
                  }
                	
            	} else {
            		// 代表内容
            		var blankIndex = descFlag.substring(2).indexOf('0000');
                    if (blankIndex > 0) {
                      topic.desc = chain3.toAscii(descFlag.substring(2).substring(0, blankIndex)); // 问题内容
                    } else {
                      topic.desc = chain3.toAscii(descFlag.substring(2));
                    }
            	}
            	
              // 统计Step
              // 处理完所有后返回
              topicArr.push(topic);
              flag++;
              //console.log(flag);
              //console.log(parseInt(topicNum, 16) - 1);
              
              if (flag == topicNum ) {  // 循环从0开始
            	 
            	  console.log(topicArr);
                resolve(topicArr)
              }
            }).catch(reject)
          }
        }).catch(reject)
      }
    }).catch(reject)
  }).catch(err => {
		console.log('getTopicList inner Promise error')
		console.log(err)
	})
}

// 创建回答   yes
export var createSubTopic = function (topicHash, desc, userAddr) {

  var result = {};
  return new Promise((resolve, reject) => {
	try {
		var postParam1 = {"SubChainAddr": subChainAddr, "Sender": userAddr};
		// _post(url, postParam1).then((datas) => {
        //     console.log(datas.result);

        // })
		getContractInfo(url, "ScsRPCMethod.GetNonce", postParam1).then(function(nonce){
			
        // 创建回答
        createSubTopicSol(desc, subChainAddr, topicHash, nonce);
        // 获取hash
        var postParam2 = {
            "SubChainAddr": subChainAddr,
            "Sender": userAddr, 
            "nonce": nonce
        };
        t = Date.now();
        sleep((packPerBlockTime + 2) * 1000);
        getContractInfo(url,"ScsRPCMethod.GetTxRlt", postParam2).then(function(subTopicHash){
          console.log("0x" + subTopicHash);
          result.subTopicHash = "0x" + subTopicHash;
          result.isSuccess = 1;
        });
			
		});
	} catch (e) {
    console.log("创建回答发生异常------" + e);
    result.subTopicHash = "";
    result.isSuccess = 0;
    reject(result);
  }
});
  
	
}

// 回答列表  (返回subTopicHash, desc, owner, voteCount)
//1 根据topicHash，查找回答hash数组  2 遍历获取到下标，根据下标查找所有回答
export var getSubTopicList = function (topicHash, pageNum, pageSize) {
  // 根据topicHash，查找回答hash数组
	return new Promise((resolve) => { 
	var topicHashByte = Hexstring2btye(topicHash.substring(2));
	var postParam1 = {"SubChainAddr": subChainAddr,
		"Request": [
			{
				"Reqtype":2,
				"Storagekey": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7],
				"Position": topicHashByte,
				"Structformat": [50]
			}
		]
	}
	var subTopicArr = [];
  var flag = 0;
  
	//for (var i = 0; i < parseInt(topicNum); i++) {   // parseInt(topicNum)
	//for (var i = (pageNum - 1) * 3; i < pageNum * pageSize; i++) {   // parseInt(topicNum)
	getContractInfo(url,"ScsRPCMethod.GetContractInfo", postParam1).then(function(subTopicHashArr){
    
		var values = [];
		var countFlag = 0;
		for (var k in subTopicHashArr) {
			if (subTopicHashArr[k].length > 7) {
				countFlag++;
			}
		}
		for (var k in subTopicHashArr)
	    {
			if (subTopicHashArr[k].length > 7) {
				asyncReturn(subTopicHashArr[k]).then((keyRes) => {
					var key = keyRes;
			        // 根据下标查找topic
			        var postParam2 = {"SubChainAddr": subChainAddr,
							"Request": [
								{
									"Reqtype": 2,
									"Storagekey": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
						    		"Position": Hexstring2btye(key),
									"Structformat": [51, 49, 51, 51, 49, 50]
								}
							]
					};
			        getContractInfo(url,"ScsRPCMethod.GetContractInfo", postParam2).then(function(subTopicResult){
			        	var subTopic = {};
			        	
		            	var str = chain3.sha3(key + subTopicIndex, {"encoding": "hex"}).substring(2);
		            	var prefixStr = str.substring(0, str.length - 2);
		            	var suffixStr = str.substring(str.length - 2, str.length);
		            	var suffixInt = parseInt(suffixStr, 16);
		            	
		            	var subTopicHash = '0x' + key;
		            	//var owner = '0x' + subTopicResult[prefixStr + converHex(suffixInt + 1)];
		            	if (subTopicResult[prefixStr + converHex(suffixInt + 1)] != undefined) {
		            		var owner = '0x' + subTopicResult[prefixStr + converHex(suffixInt + 1)];
		            		var voteCount = 0; 
		            		if (subTopicResult[prefixStr + converHex(suffixInt + 4)] != '') {
		            			voteCount = parseInt(subTopicResult[prefixStr + converHex(suffixInt + 4)], 16);
		            		}
		                	subTopic.subTopicHash = subTopicHash;
		                	subTopic.owner = owner;
		                	subTopic.voteCount = voteCount;
		                	
		                	var descFlag = subTopicResult[prefixStr + converHex(suffixInt + 2)];
		                	if (descFlag.length < 7) {
		              		  	// 长string, 这里代表长度，需要连接
		    	                var descStr = chain3.sha3(prefixStr + converHex(suffixInt + 2), 
		    	                {"encoding": "hex"}).substring(2);  // 再做一次hash获取字符串第一部分的key
		    	                var prefixStr = descStr.substring(0, descStr.length - 2);
		    	                var suffixStr = descStr.substring(descStr.length - 2, descStr.length);
		    	                var suffixInt = parseInt(suffixStr, 16);
		    	                //var owner = topicResult[prefixStr + converHex(suffixInt + 1)]; 
		    	                var valueArr = [];
		    	                var descStr = "";
		    	                for (var k in subTopicResult) {
		    	                  if (k.indexOf(prefixStr) >= 0) {
		    	                    descStr = descStr + topicResult[k].substring(2);
		    	                  }
		    	                }
		    	              	
		    	              	var blankIndex = descStr.indexOf('0000');
		    	                if (blankIndex > 0) {
		    	                	subTopic.desc = chain3.toAscii(descStr.substring(0, blankIndex)); // 问题内容
		    	                } else {
		    	                	subTopic.desc = chain3.toAscii(descStr);
		    	                }
		                  	
		    	          	} else {
		    	          		// 代表内容
		    	          		var blankIndex = descFlag.substring(2).indexOf('0000');
		    	                  if (blankIndex > 0) {
		    	                	  subTopic.desc = chain3.toAscii(descFlag.substring(2).substring(0, blankIndex)); // 问题内容
		    	                  } else {
		    	                	  subTopic.desc = chain3.toAscii(descFlag.substring(2));
		    	                  }
		    	                  
		    	          	}
		                	
		                	subTopicArr.push(subTopic);
		    	            flag++;
		    	            if (flag == countFlag) {
		    	        		resolve(subTopicArr);
		    	        	//	return subTopicArr
		    	        	}
		            	} else {
		            		// 此topic没有回复
		            	}
			        	
			        });
				});	
	    }
	    }
		
	});
});
	
}


// 查询子链token余额 
export var getMicroChainBalance = function (userAddr) {
	var postParam = {"SubChainAddr": subChainAddr,"Sender": userAddr};
	return getContractInfo(url, "ScsRPCMethod.GetBalance", postParam).then(function(tokenBalance){
		console.log(tokenBalance / Math.pow(10, decimals));
		return tokenBalance / Math.pow(10, decimals);
	})
}

// 点赞    yes
export var approveSubTopic = function (voter, subTopicHash) {
	
  var postParam = {"SubChainAddr": subChainAddr, "Sender": voter};
  return getContractInfo(url,"ScsRPCMethod.GetNonce", postParam).then(function(nonce){
    voteOnTopic(voter, null, subChainAddr, subTopicHash, nonce);
    return 1;
  });
	
}

// autoCheck
export var autoCheck = function (userAddr) {
	var postParam = {"SubChainAddr": subChainAddr, "Sender": userAddr};
	return getContractInfo(url,"ScsRPCMethod.GetNonce", postParam).then(function(nonce){
    autoCheckSol(subChainAddr, nonce);
    return 1;
	});
}

function converHex(intValue) {   // 确保返回的是两位，单个的前面加0
  var res = intValue.toString(16);
  if (res.length == 1) {
     res = "0" + res
  }
  return res;
}

function asyncReturn(req) {
	return new Promise((resolve) => {
		if (req.length > 7) {
			var key = req.substring(2);
			resolve(key);
		}
	});
}