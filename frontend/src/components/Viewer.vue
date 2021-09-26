<template>
    <div>
        <h2 class="mt-3" style="font-size: 48px; text-align: center; font-weight: 800;">View asset</h2>
        
    </div>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider'
import {createRaribleSdk} from '@rarible/protocol-ethereum-sdk'
import Web3 from 'web3'
import { Web3Ethereum } from "@rarible/web3-ethereum"

export default {
    name: "Viewer",
    
    data: function() {
        return {
            itemId: ""
        }
    },

    methods: {
        connect: async function () {
            var accounts = await this.provider.request({method: "eth_requestAccounts"})
            this.accounts = accounts
            localStorage.setItem("accountsProvided", true)

            const web3 = new Web3(this.provider)
            this.sdk = createRaribleSdk(new Web3Ethereum({ web3 }), "ropsten")
        },

        getToken: async function() {
            const tokenData = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft-order/items/${this.itemId}?includeMeta=true`).then((res) => res.json())
            console.log(tokenData)
        }
    },

    mounted: async function() {
        this.itemId = this.$route.params.id
        this.provider = await detectEthereumProvider()
        if (this.provider) {        
            if (localStorage.getItem("loggedIn") == "true") {
                try {  
                    await this.connect()
                    await this.getToken()
                } catch(e) {
                alert(e)
                localStorage.setItem("loggedIn", false)
                window.location.replace("/#/login")
                }
            } else {
                window.location.replace("/#/login")
            }
        } else {
            window.location.replace("/#/login")
        }
    }
}
</script>

<style scoped>

</style>