<template>
    <div>
        <div v-if="ethAvailable" style="height: 90vh;">
            <div style="position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);">
                <div v-if="accounts.length == 0">
                    <p style="font-size: 36px; font-weight: 400;">It seems you have not connected your MetaMask. Go on... We'll wait.</p>
                    <button @click="connect" class="btn btn-primary px-3 py-3" style="border-radius: 20px; font-size: 64px; font-weight: 600;">Connect</button>
                </div>
            </div>
        </div>
        <div v-else style="position: absolute; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);">
            <p style="font-size: 36px; font-weight: 400;">Please install metamask to proceed</p>
        </div>
    </div>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider'

export default {
    name: "Login",

    data: function() {
        return {
            ethAvailable: false,
            provider: null,
            accounts: []
        }
    },

    methods: {
        connect: async function() {
            try {
                this.accounts = await this.provider.request({method: "eth_requestAccounts"})
                localStorage.setItem("loggedIn", true)
                window.location.replace("/")
            } catch(e) {
                alert(e)
                localStorage.setItem("loggedIn", false)
            }
        }
    },

    mounted: async function() {
        if (localStorage.getItem("loggedIn") == "true") {
            window.location.replace("/")
        } else {
            this.provider = await detectEthereumProvider()
            if (this.provider) {
                this.ethAvailable = true
            }
        }
    }
}
</script>

<style scoped>

</style>