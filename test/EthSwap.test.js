// const { assert } = require('chai');

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap',(accounts) => {
    let token,ethSwap
    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new()
        await token.transfer(ethSwap.address,tokens('1000000'))
    })

    describe('Token deployement', async () => { 
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name,'Thomas Token')
        })    
    })
    
    describe('EthSwap deployement', async () => { 
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name,'EthSwap Instant Exchange')
        })
        
        it('contract has tokens',async () => {
            let balance = token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(),tokens('1000000'))
        })
    })
})