export default {
	data() {
		return {

		}
	},
	computed: {
		loginStatus() {
			return this.$store.getters.loginStatus
		},
		userInfo() {
			return this.$store.getters.userInfo || {}
		},
		global() {
			return this.$store.getters.global
		},
		companyName() {
			return this.$store.getters.companyName
		},
	},
	methods: {


	}


}
