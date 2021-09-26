<template>
  <div>
    <div style="height: 90vh;">
      <div style="position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);">
        <div>
          <p style="font-size: 36px; font-weight: 400;">Create your asset</p>
          <form @submit.prevent="mint">
            <div class="form-group">
              <label class="form-text">Name: </label>
              <input class="form-control" type="text" v-model="form.name">
            </div>
            <div class="form-group">
              <label class="form-text">Description: </label>
              <textarea class="form-control" v-model="form.description"></textarea>
            </div>
            <div class="form-group">
            <label class="form-text">Unlockable content: </label>
              <select class="form-control" v-model="form.content.type">
                <option v-for="t in types" :key="t.value" :value="t.value">{{ t.text }}</option>
              </select>
            </div>
            <div class="form-group">
              <div v-if="form.content.type == 'text'">
                  <label class="form-text">Secret text: </label>
                  <input class="form-control" type="text" v-model="form.content.value">
              </div>
              <div v-if="form.content.type == 'url'">
                  <label class="form-text">Secret URL: </label>
                  <input class="form-control" type="text" v-model="form.content.value">
              </div>
              <div v-if="form.content.type == 'image'">
                  <label class="form-text">Secret image: </label>
                  <input @change="uploadContent" class="form-control-file" type="file" accept="image/*">
              </div>
              <div v-if="form.content.type == 'video'">
                  <label class="form-text">Secret video: </label>
                  <input @change="uploadContent" class="form-control-file" type="file" accept="video/*, video/mp4">
              </div>
            </div>
            <div class="form-group">
              <label class="form-text">Cost (in wei): </label>
              <input class="form-control" type="number" v-model="form.cost">
            </div>
            <div class="form-group">
              <label class="form-text">Amount of assets: </label>
              <input class="form-control" type="number" v-model="form.supply">
            </div>
            <div class="form-group">
              <label class="form-text">Preview image/video: </label>
              <input @change="uploadPreview" class="form-control-file" type="file" accept="image/*, video/mp4">
            </div>
            <div v-if="!fileLoading && !previewLoading">
              <button v-if="!mintRequestSent" type="submit" class="btn btn-primary">Create!</button>
              <p v-else>Loading...</p>
            </div>
            <div v-else>
              <p>File upload in progress...</p>
              <button v-if="!mintRequestSent" disabled type="submit" class="btn btn-secondary">Create!</button>
            </div>
          </form>
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
import {toAddress, toBinary} from '@rarible/types'
import {create} from 'ipfs-http-client'

export default {
  name: 'Mint',
  data: function() {  
    return {
      contractAddress: "0x516b22bd55c88bb86044adbedef16be22e7d4b4a",
      provider: undefined,
      sdk: undefined,
      accounts: [],
      ipfsClient: undefined,
      fileLoading: false,
      previewLoading: false,

      types: [
        {text: "Text", value: "text"},
        {text: "URL", value: "url"},
        {text: "Twitch", value: "twitch"},
        {text: "YouTube", value: "youtube"},
        {text: "Image", value: "image"},
        {text: "Video", value: "video"},
      ],

      form: {
        name: "",
        description: "",
        cost: 0,
        preview: null,
        supply: 1,
        content: {
          type: "text",
          value: null
        }
      },

      mintRequestSent: false,
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

    uploadPreview: async function(e) {
      this.previewLoading = true
      this.form.preview = e.target.files[0]
      this.previewLoading = false
    },

    uploadContent: async function(e) {
      this.fileLoading = true
      this.form.content.value = await this.uploadToIpfs(e.target.files[0]);
      this.fileLoading = false
    },

    uploadToIpfs: async function(data) {
      const ipfsResp = await this.ipfsClient.add(data)
      return ipfsResp.path
    },

    mint: async function() {
        this.mintRequestSent = true
        const previewCID = await this.uploadToIpfs(this.form.preview)
        var toMint = {
          name: this.form.name,
          description: this.form.description,
          lockAble: true,
          attributes: [],
        }

        if (this.form.preview.type.startsWith("image")) {
          toMint.image = previewCID
        } else {
          toMint.animation_url = previewCID
        }

        const itemCID = await this.uploadToIpfs(JSON.stringify(toMint))
        
        const res = await this.sdk.nft.mint({
          collection: {
            id: toAddress(this.contractAddress),
            type: "ERC1155",
            supportsLazyMint: true,
          },
          uri: itemCID,
          supply: this.form.supply,
          creators: [{ account: toAddress(this.accounts[0]), value: this.form.cost }],
          royalties: [],
          lazy: true
        })
        console.log(res)
        const content = window.btoa(unescape(encodeURIComponent( JSON.stringify(this.form.content) )))
        const lockedContent = `I would like to set lock for ${res.itemId}. content is ${content}`
        const signatureResult = await this.provider.send("personal_sign", [lockedContent, this.accounts[0]])
        
        const lockBody = {
          content: this.form.content.value,
          signature: toBinary(signatureResult.result),
          signer: toAddress(this.accounts[0])
        }

        await fetch(`https://api-ropsten.rarible.com/marketplace/api/v4/items/${res.itemId}/lock`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(lockBody)})
        alert("Asset created successfully!")
        window.location.replace("/#/profile")
    }
  },

  mounted: async function () {
    this.ipfsClient = await create("https://ipfs.infura.io:5001")

    const provider = await detectEthereumProvider()

    if (provider) {
      this.provider = provider
      
      if (localStorage.getItem("loggedIn") == "true") {
        try {  
          await this.connect()
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
