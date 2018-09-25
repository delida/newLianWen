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


var keystore_login = "{\"version\":3,\"id\":\"ecd695b5-98cd-408b-a246-c0e63f4c0d16\",\"address\":\"b80b7e2b6639277f12d0b9b79f283c44f780f8c8\",\"crypto\":{\"ciphertext\":\"13a00ebd41b98a62c948017c9a53b2a15055201562b47cdc841bebc154e4b525\",\"cipherparams\":{\"iv\":\"2d205655ddfa8b28ecaa69e08d6f8f50\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"salt\":\"dcff1c077afbe8180b7b2f401c6fccb8ccd64d564b77c6ce7ae60cb6a72274bd\",\"n\":8192,\"r\":8,\"p\":1},\"mac\":\"2f323aadbc0c91708dfda1669046e0775d8f7257c829dff1315e3eae44e0f690\"}}";

var keystore_myTest = "{\"version\":3,\"id\":\"91b62e72-d454-46f9-8382-686864309b1a\",\"address\":\"b6d00a2265668fb0efaaba89ea24e816bd537ef7\",\"crypto\":{\"ciphertext\":\"3366505d6543f3f87bcf75d106562d550943ae8b4e7222e69214b7aafb61dea0\",\"cipherparams\":{\"iv\":\"ad34a9d430990f1beda8fea48607f847\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"salt\":\"708b606d25787a330e7ecadfe5d8f7e02faee125a7012c0c0eb6480469ca4167\",\"n\":8192,\"r\":8,\"p\":1},\"mac\":\"fc82e0691007b018cf48e689b66e8f19d122ad83b95a763921e0bde0076c6d62\"}}";

var keystore_youTest = "{\"version\":3,\"id\":\"7ce8fb55-264b-4ba0-89cd-97840ca7bc4f\",\"address\":\"e7e52b94e9a82351302260ec39a300e9f00aee4c\",\"crypto\":{\"ciphertext\":\"6b8c6d2aa87cc3fff5cae9a984bf89f8b1b0307a6c796b65616371de7c1e558c\",\"cipherparams\":{\"iv\":\"f664b90fae01d8984072e65bd7e0b6e7\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"salt\":\"d3804059e4d6b809f0a9e1b9a1562153d544f2586580374a9120f061695b6c33\",\"n\":8192,\"r\":8,\"p\":1},\"mac\":\"e426a88e8bf9e47b8ad2eee53d835d99b510c159972c4afd8dc43d8be481b39a\"}}";

  var pwd = "123456";
  var addr = "0xb80b7e2b6639277f12d0b9b79f283c44f780f8c8";
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

    // 登录账户     yes
    //console.log(loginUser(addr, pwd, keystore));

    //获取moac和erc20余额     yes
    // getBalance(config.userAddr2, config.marketableTokenAddr).then((data) => {
    //   console.log(data);
    //   //this.setState({r:data.erc20Balance});
    // });

    // 充值   yes
    // chargeToken(config.userAddr1, 100, config.marketableTokenAddr, 
    //   config.pwd, keystore_youTest, config.subChainAddr).then((data) => {
    //      console.log(data);
    // })

    // 提币    yes
    // redeemToken(config.userAddr1, 10, config.marketableTokenAddr, config.pwd, keystore_youTest,config.subChainAddr, config.rpcIp).then((data) => {
    //  console.log(data);
    // })


    

    //---------business--------------  


    // 创建topic  
    // createTopic(1, "are you ok", 30, 
    // config.userAddr1, config.pwd, keystore_youTest, config.subChainAddr, config.rpcIp).then((data) => {
    //   console.log(data);
    // })
    

    // 获取topic列表(暂未分页)      yes
    //  getTopicList(0,0, config.subChainAddr,
    //  config.rpcIp).then((data) => {
    //   //this.setState({r:data});
    // });

    // 创建subTopic   
    // 0x2ae964d3f6e550e335fa662c92f39b6b55aed8a5c02af954aac1a63a473bec2f
    // 
    // 
    // createSubTopic("0xda7d2be5c2aa7226bb9dc41b30af2b68a045f485ff61f849b64ca40a7fbc3f67", 
    //   "it is good", config.userAddr1, config.pwd, keystore_youTest, config.subChainAddr, config.rpcIp).then((data) => {
    //   console.log(data);
    // });

    // 点赞     yes    0xcf9238d5e7d141680ae83aae4d9042889a6307797d23a477055f70386b181fcb
    //  approveSubTopic(config.userAddr1, 
    //    "0x84c1926cc0a2207354e72792fb45efe40d089b9898929092c5ff6e8fd06b3496", config.subChainAddr,
    // config.pwd, keystore_youTest, config.rpcIp).then((data) => {
    //     console.log(data);
    //    });

    // 回答列表(暂未做分页)    yes
    // getSubTopicList("0xda7d2be5c2aa7226bb9dc41b30af2b68a045f485ff61f849b64ca40a7fbc3f67",
    //      0,0, config.subChainAddr,config.rpcIp).then((data) => {
    //        console.log(data);
    // });

    // 获取子链余额   yes
    // getMicroChainBalance(config.userAddr1, config.pwd, "", config.subChainAddr, config.rpcIp).then((data) => {
    //   this.setState({r:data});
    // });

    // autoCheck
    // autoCheck(config.userAddr1, config.pwd, keystore_youTest, config.subChainAddr, config.rpcIp).then((data) => {
    //  console.log(data);
    //   this.setState({r:data});
    // });

    // 版块管理  yes
    // getBoardList().then((data) => {
    //   console.log(data);
    // });

    // 我的链问列表    yes
    // myTopicList(config.userAddr1, config.subChainAddr, config.pwd, keystore_youTest, 
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
