import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight } from 'react-native';
import './global';

import Chain3 from 'chain3';
import {_post} from './api/HttpFecth'
//import {testFetch} from './api/lwAccountApi';
const chain3 = new Chain3(
  new Chain3.providers.HttpProvider('https://www.moacwalletonline.com/test')
);
export default class App extends React.Component {
   constructor(props) {
    super(props);
     this.state={
      r:''
     }
   }
  testFetch() {
    var url = "http://119.23.27.43:8549/rpc";

      var data = {"jsonrpc": "2.0", "id": 0, "method": "ScsRPCMethod.GetNonce", 
      "params": {"SubChainAddr": "0x7ee21d6e107367907973359570709c5ed451e182", 
      "Sender": "0xe7e52b94e9a82351302260ec39a300e9f00aee4c"}};
      
    //   fetch(url,{
    //     method:'POST',
    //     headers:{
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
        
    //     },
    //     body:JSON.stringify(data),
    //   })

    //   //上面一行会返回响应对象，即response
    //  .then((response)=>{
    //   if (response.ok) {
    //     console.log(response);
    //    //  return JSON.stringify(response);
    //     return response.json();
    //   }
       
    //  })
    //  //response.json()将返回一个json类型对象
    //  .then((responseData)=>{
    //   console.log("data:--------" + responseData);
    //   this.setState({r:responseData})
    //  //注意我们在Promise调用链的最后调用了done() —— 这样可以抛出异常而不是简单忽略。
    //  }).done();

    _post(url, data).then((re) => {
      console.log("------------" + re.result);
    });
      
}

  render() {
    //  this.renderTest();
    return (
      <View style={styles.container}>
        {/* <Text>{this.state.r}</Text> */}
        <TouchableHighlight
                    underlayColor='rgb(210,260,260)'
                    style={{padding: 10, marginTop: 10, borderRadius: 5,}}
                    onPress={this.testFetch.bind(this)}
                >
                    <Text >get请求</Text>
        </TouchableHighlight>
        
        <Text>{this.state.r.result}</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }

  renderTest() {
    chain3.mc.getBlock('latest', (error, response) => {
      if (!error)
        this.setState({r:JSON.stringify(response)})
    });
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
