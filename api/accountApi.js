import secp256k1 from 'secp256k1';
import keccak from 'keccak';
//import {encrypt} from "./accounts"
import {decrypt} from "./accounts"
import {testbuyMintToken} from "./scAccount"
import {testrequestEnterMicrochain} from "./scAccount"
import {dappredeemFromMicroChain} from "./scAccount"
import {testsellMintToken} from "./scAccount"
import {getMicroChainBalance} from "./bussApi"

import config from "./lwconfig.json"
import assert from "assert"
import Chain3 from 'chain3';

var pwd = config.pwd;
var userAddr = config.userAddr;
var subChainAddr = config.subChainAddr;
var chain3 = new Chain3(new Chain3.providers.HttpProvider(config.vnodeIp));
var ip = config.rpcIp;
var port = config.port;
var packPerBlockTime = config.packPerBlockTime;   // 子链出块时间单位s
var decimals = config.decimals;   // 子链token精度
var mc = chain3.mc;
//import {randomBytes} from "./randomUtil.js"
//import Thirdparty from "../thirdparty.js"

//import { randomBytes } from 'react-native-secure-randombytes'
//window.randomBytes = asyncRandomBytes;

// import { randomBytes } from 'react-native-randombytes'
var marketabletokenaddr = config.marketableTokenAddr;
var marketabletokenAbi= "[{\"constant\":true,\"inputs\":[{\"name\":\"useraddr\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"sellMintTokenPre\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"useraddr\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"sellMintToken\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_from\",\"type\":\"address\"},{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_subtractedValue\",\"type\":\"uint256\"}],\"name\":\"decreaseApproval\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newowner\",\"type\":\"address\"}],\"name\":\"updateOwner\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"addr\",\"type\":\"address[]\"},{\"name\":\"bals\",\"type\":\"uint256[]\"}],\"name\":\"redeemFromMicroChain\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"useraddr\",\"type\":\"address\"},{\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"buyMintToken\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"useraddr\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"requestEnterMicrochain\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"priceOneGInMOAC\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_addedValue\",\"type\":\"uint256\"}],\"name\":\"increaseApproval\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"},{\"name\":\"_spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"tokensupply\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"}]"
var marketabletokenContract=chain3.mc.contract(JSON.parse(marketabletokenAbi));
export var marketabletoken=marketabletokenContract.at(marketabletokenaddr);

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
///////测试提交
// 创建账户 (scripts环境不可用)
export function registerUser(pwd) {
	var registerInfo = {};
	var privateKey = new Buffer("7e2e56890c4af2e65c400eb23d5e5e4ce60eb328ba27f1dd8c207a013b716d75", 'hex');//crypto.randomBytes(32)
	
	
	var publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
	
	var address = keccak('keccak256').update(publicKey).digest().slice(-20);
	
	var privateKeyStr = "0x" + privateKey.toString('hex');
	var addressStr = "0x" + address.toString('hex');
	console.log(addressStr);
	var keystore = encrypt(privateKeyStr, pwd);
	
	registerInfo.userAddr = addressStr;
	registerInfo.keystore = keystore;
	return registerInfo;
}


// 登录账户   yes
// 1 输入的userAddr是否在移动端存储的所有keystore中，若不存在直接返回钱包地址或者密码错误
// 2 若存在，传入userAddr, pwd, keystore调用此方法
// 3 pwd和keystore解析出来私钥，地址，对比地址和输入地址是否一致
export function loginUser(addr, pwd, keystore) {
	try {
		
		var keystoreObj = JSON.parse(keystore);
		var address = decrypt(keystoreObj, pwd).address + '';
		if (address.toLowerCase() == addr.toLowerCase()) {
			return 1
		} else {
			return 0;  // 登录失败
		}	
	} catch (e) {
		if (e.message == "Key derivation failed - possibly wrong password") {
			return 2; // 密码错误
		} else {
			return 0;  // 登录失败
		}
		
	}
	
}

// 查询主链的MOAC和erc20余额
export var getBalance = function (userAddr) {
	return new Promise(function(resolve, reject){
		
		mc.getBalance(userAddr, (err, moacRes) => {
			
			var todata = "0x70a08231" + "000000000000000000000000" + config.userAddr.substring(2);
			chain3.mc.call({
			to: config.marketableTokenAddr,  // 合约地址
			data: todata
			}, 'latest', (error, response) => {
				var balance = {};
				balance.moacBalance = chain3.fromSha(moacRes.toString(), 'mc');
				balance.erc20Balance = chain3.fromSha(parseInt(response.substring(2),16), 'mc');
				//console.log(balance);
				resolve(balance);
				
			});	
		});
	});	
}

// 充值（moac兑换主链token, 然后充值进子链）
export var chargeToken = function (userAddr, value) {
	return new Promise((resolve, reject) => {
		try {
			getBalance(userAddr).then((balance1) => {    // 查询当前erc20余额
				console.log("充值兑换前---------" + balance1);
				testbuyMintToken(userAddr, pwd, value); // moac兑换主链erc20

				var interval = setInterval(function(){
					console.log("wait for buyToken-----");
					getBalance(userAddr).then((balance2) => { 
						if(balance1.erc20Balance != balance2.erc20Balance){   // 每3s执行一次查询是否兑换成功
							console.log("充值兑换后---------" + balance2);
							console.log("开始子链充值-----");
							testrequestEnterMicrochain(userAddr, pwd, value);  // 兑换成功则执行子链充值，并跳出interval
							clearInterval(interval);
							resolve(1);
						}
					});	
				}, 3000);
			});
			
		} catch (e) {
			console.log("充值报错--------" + e);
			reject(0);
		}
	});
	
	
}

export var buyToken = function (userAddr, value) {
	testbuyMintToken(userAddr, pwd, value); 
}


// 提币
export var redeemToken = function (userAddr, value) {
	return new Promise((resolve, reject) => {
	try {
		getBalance(userAddr).then((balance1) => {    // 查询当前erc20余额
			console.log("提币前主链代币---------" + balance1);
			dappredeemFromMicroChain(userAddr, pwd, value).then((data) => {   // 提币
				var interval = setInterval(function(){
					console.log("wait for redeemToken-----");
					getBalance(userAddr).then((balance2) => {    // 查询当前erc20余额
						
						if(balance1.erc20Balance != balance2.erc20Balance){   // 每3s执行一次查询是否兑换成功
							console.log("提币后主链代币---------" + balance2);
							console.log("提币成功，开始兑换moac-----");
							testsellMintToken(userAddr, pwd, value);  // 提币成功则执行moac兑换，并跳出interval
							clearInterval(interval);
							resolve(1);
						}
					});	
				}, 3000);
			});
		});

	}catch (e) {
		console.log("提币报错--------" + e);
		reject(0);
	}
});
	
}