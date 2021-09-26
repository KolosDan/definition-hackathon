<template>
    <div>
        <div class="container-fluid ml-5">
            <h2 class="mt-3" style="font-size: 48px; text-align: center; font-weight: 800;">Your assets</h2>

            <div class="row mt-5">
                <div class="col-lg-4 d-flex align-items-stretch mb-3" v-for="t in tokens" :key="t.id">
                    <div class="card" style="width: 25rem;">
                        <div v-if="t.meta.image">
                            <img class="card-img-top" :src="'https://ipfs.io/ipfs/' + t.meta.image.url.ORIGINAL">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{{ t.meta.name }}</h5>
                            <p class="card-text">{{ t.meta.description }}</p>
                        </div>
                        <div class="card-footer">
                            <a href="#" class="btn btn-primary mx-3">Manage</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider'
import {createRaribleSdk} from '@rarible/protocol-ethereum-sdk'
import Web3 from 'web3'
import { Web3Ethereum } from "@rarible/web3-ethereum"

export default {
    name: "Profile",

    data: function() {
        return {
            contractAddress: "0x516b22bd55c88bb86044adbedef16be22e7d4b4a",
            sdk: null,
            accounts: [],
            tokens: []
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
        getTokens: async function() {
            const tokenResp = await fetch(`https://api-dev.rarible.com/protocol/v0.1/ethereum/nft/items/byOwner?owner=${this.accounts[0]}&includeMeta=true`).then((resp) => resp.json())
            this.tokens = tokenResp.items.filter(t => t.contract == this.contractAddress)
        }
    },

    mounted: async function() {
        this.provider = await detectEthereumProvider()
        if (this.provider) {        
            if (localStorage.getItem("loggedIn") == "true") {
                try {  
                    await this.connect()
                    await this.getTokens()
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