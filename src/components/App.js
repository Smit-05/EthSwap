import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    
  }
  
  async loadBlockchainData(){

    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    // console.log(accounts[0])
    this.setState({account:accounts[0]})

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance: ethBalance})
    // console.log(this.state.ethBalance)

    const networkid = await web3.eth.net.getId()
    const tokenData = Token.networks[networkid]
    if(tokenData){
      const token = new web3.eth.Contract(Token.abi,tokenData.address)
      // console.log(token)
      this.setState({token:token})
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      console.log("tokenbalance",tokenBalance.toString())
      this.setState({tokenBalance:tokenBalance.toString()})

      
    }else{
      window.alert('Token contract not deployed to detected network.')
    }
    const ethSwapData = EthSwap.networks[networkid]
    if(ethSwapData){
      const ethSwap = new web3.eth.Contract(EthSwap.abi,ethSwapData.address)
      // console.log(token)
      this.setState({ethSwap:ethSwap})
    }else{
      window.alert('EthSwap contract not deployed to detected network.')
    }

    this.setState({loading:false})
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }
  }

  
  render() {
    let content

    if(this.state.loading){
      content = <p id="loader" className="text-center">Loading...</p>
    }else{
      content = <Main
      ethBalance={this.state.ethBalance}
      tokenBalance={this.state.tokenBalance}
      buyTokens={this.buyTokens}
      sellTokens={this.sellTokens}
    />
    }
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
