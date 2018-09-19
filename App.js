import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight } from 'react-native';
import './global';
import Chain3 from 'chain3';
import {registerUser} from './api/accountApi';
import {loginUser} from './api/accountApi';
import {chargeToken} from './api/accountApi';
import {redeemToken} from './api/accountApi';
import {getBalance} from './api/accountApi';
import {createTopic} from './api/bussApi';
import {autoCheck} from './api/bussApi';
import {createSubTopic} from './api/bussApi';
import {getMicroChainBalance} from './api/bussApi';
import {getTopicList} from './api/bussApi';
import {approveSubTopic} from './api/bussApi';
import {getSubTopicList} from './api/bussApi';
import {buyToken} from './api/accountApi';
import {getBoardList} from './api/bussApi';
import {myTopicList} from './api/bussApi';

import config from "./api/lwconfig.json"


var keystore = {"version":3,"id":"ecd695b5-98cd-408b-a246-c0e63f4c0d16",
	"address":"b80b7e2b6639277f12d0b9b79f283c44f780f8c8",
	"crypto":{"ciphertext":"13a00ebd41b98a62c948017c9a53b2a15055201562b47cdc841bebc154e4b525",
	"cipherparams":{"iv":"2d205655ddfa8b28ecaa69e08d6f8f50"},
	"cipher":"aes-128-ctr","kdf":"scrypt",
	"kdfparams":{"dklen":32,"salt":"dcff1c077afbe8180b7b2f401c6fccb8ccd64d564b77c6ce7ae60cb6a72274bd",
  "n":8192,"r":8,"p":1},"mac":"2f323aadbc0c91708dfda1669046e0775d8f7257c829dff1315e3eae44e0f690"}};


  var pwd = "123456";
  var addr = "0xb80b7e2b6639277f12d0b9b79f283c44f780f8c8";
  var userAddr = config.userAddr;
  var subChainAddr = config.subChainAddr;
  var packPerBlockTime = config.packPerBlockTime;   // 子链出块时间单位s
  var decimals = config.decimals;   // 子链token精度
  var chain3 = new Chain3(new Chain3.providers.HttpProvider(config.vnodeIp));
  var mc = chain3.mc;



export default class App extends React.Component {
   constructor(props) {
    super(props);
     this.state={
      r:''
     }
   }
  testFetch() {
    
  }

  render() {
    this.renderTest();
    return (
      <View style={styles.container}>
       
        {/* <TouchableHighlight
                    underlayColor='rgb(210,260,260)'
                    style={{padding: 10, marginTop: 10, borderRadius: 5,}}
                    onPress={this.testFetch.bind(this)}
                >
                    <Text >get请求</Text>
        </TouchableHighlight> */}
        <Text>{this.state.r}</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }

  renderTest() {

    //---------account--------------

    // 创建账户(scripts环境报错)
    //console.log(registerUser("123456"));

    // 登录账户  
    //console.log(loginUser(addr, pwd, JSON.stringify(keystore)));

    //获取moac和erc20余额 
    // getBalance(config.userAddr2, config.marketableTokenAddr).then((data) => {
    //   console.log(data);
    //   //this.setState({r:data.erc20Balance});
    // });

    // 充值
    // chargeToken(config.userAddr2, 15, config.marketableTokenAddr, config.pwd, "").then((data) => {

    // })

    // 提币
    // redeemToken(config.userAddr2, 0.3, config.marketableTokenAddr, config.pwd, "").then((data) => {

    // })


    

    //---------business--------------  


    // 创建topic  
    // createTopic(1, "are you happy, if you are not happy, i will ask you if you are ok, if you are not ok?", 30, 
    // config.userAddr2, config.pwd, "", config.subChainAddr, config.rpcIp).then((data) => {
    //   console.log(data);
    // })

    // 获取topic列表(暂未分页)  
    //  getTopicList(0,0, config.pwd, "", config.subChainAddr,
    //  config.rpcIp).then((data) => {
    //   //this.setState({r:data});
    // });

    // 创建subTopic   
    // 0x2ae964d3f6e550e335fa662c92f39b6b55aed8a5c02af954aac1a63a473bec2f
    // 
    // 
    // createSubTopic("0xcd5cffdd06ae430fe5cbb734b86f2aaa81abb7e75bbf9c62594748b856c14abb", 
    //   "it is good", config.userAddr2, config.pwd, "", config.subChainAddr, config.rpcIp).then((data) => {
    //   console.log(data);
    // });

    // 点赞  0x2ae964d3f6e550e335fa662c92f39b6b55aed8a5c02af954aac1a63a473bec2f
    //  approveSubTopic(config.userAddr2, 
    //    "0x2ae964d3f6e550e335fa662c92f39b6b55aed8a5c02af954aac1a63a473bec2f", config.subChainAddr,
    // config.pwd, "", config.rpcIp).then((data) => {
    //     console.log(data);
    //    });

    // 回答列表(暂未做分页)
    // getSubTopicList("0xcd5cffdd06ae430fe5cbb734b86f2aaa81abb7e75bbf9c62594748b856c14abb",
    //      0,0, config.pwd, "", config.subChainAddr, config.rpcIp).then((data) => {
    //        console.log(data);
    // });

    // 获取子链余额
    // getMicroChainBalance(config.userAddr2, config.pwd, "", config.subChainAddr, config.rpcIp).then((data) => {
    //   this.setState({r:data});
    // });

    // autoCheck
    // autoCheck(userAddr, config.pwd, "", config.subChainAddr, config.rpcIp).then((data) => {
    //   this.setState({r:data});
    // });

    // 版块管理
    // getBoardList().then((data) => {
    //   console.log(data);
    // });

    // 我的链问列表
    // myTopicList(config.userAddr2, config.subChainAddr, config.pwd, "", 
    //   config.rpcIp, config.deployLwSolAdmin).then((data) => {
    //   console.log(data);
    // });

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
