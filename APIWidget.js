document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCart', () => {
        return {
            title: 'Musawenkosi`s Pizza Cart using an API',
            pizzas: [],
            username: '',
            cartId: '',
            cartPizzas: [],
            cartTotal: 0.00,
            paymentAmount: 0,
            message: '',
            viewCart: false,
            showChangeMessage: false,
            featuredPizzas: [],
           
            
            login() {
                if (this.username.length > 2) {
                    localStorage['username'] = this.username;
                    this.createCart();
                } else {
                    alert("Username is too short");
                }

            },

            logout() {
                if (confirm('Do you want to logout?')) {
                    this.username = '';
                    this.cartId = '';
                    localStorage['cartId'] = '';
                    localStorage['username'] = '';
                }

            },


            createCart() {
                if (!this.username) {
                    //this.cartId = 'No username to create a cart for'
                    return;
                }

                const cartId = localStorage['cartId'];

                if (cartId) {
                    this.cartId = cartId;
                    return Promise.resolve()
                } else {
                    const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                    return axios.get(createCartURL)
                        .then(result => {
                            this.cartId = result.data.cart_code;
                            localStorage['cartId'] = this.cartId;
                        });
                }

            },

            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                return axios.get(getCartURL);
            },

            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },

            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },

            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay',
                    {
                        "cart_code": this.cartId,
                        amount
                    })
            },

            getFeaturedPizza() {
                const getFeaturedPizzaURL = 'https://pizza-api.projectcodex.net/api/pizzas/featured?username=HopeLotriet'
                return axios.get(getFeaturedPizzaURL)
                    .then(result => {
                        this.featuredPizzas = result.data.pizzas;
                        // console.log(this.featuredPizzas)

                    })
            },

            featured() {
                return axios.post('https://pizza-api.projectcodex.net/api/pizzas/featured',
                    {
                        "username": this.username,
                        "pizza_id": pizzaId
                    }).then(() => {
                        this.getFeaturedPizza()
                    })

            },

      
            showCartData() {
                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                    //alert(this.cartTotal);
                });
            },

            init() {
                const storedUsername = localStorage['username'];
                if (storedUsername) {
                    this.username = localStorage['username'];
                }

                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        // code here
                        //console.log(result.data);
                        this.pizzas = result.data.pizzas
                    }).then(() => {
                        return this.getFeaturedPizza()
                    })

                if (this.cartId) {
                    this.createCart()
                        .then(() => {
                            this.showCartData();
                        })
                }

            },

            addPizzaToCart(pizzaId) {
                //alert(pizzaId)
                this
                    .addPizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },

            removePizzaFromCart(pizzaId) {
                //alert(pizzaId)
                this
                    .removePizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },

            featuredPizza(pizzaId) {
                this.featured(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },

            payForCart() {
                //alert("Pay Now!" + this.paymentAmount)
                this.pay(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 3000);
                        } else {
                            this.message = 'Payment successful! Enjoy your pizza😜!';

                            const change = this.paymentAmount - this.cartTotal;
                            if (change > 0) {
                                this.message = `Payment successful 😜 and your Change: R${change.toFixed(2)}`;
                            } else if (change < 0) {
                                this.message = 'Insufficient payment.';
                            } else {
                                this.message = 'Payment successful! Enjoy your pizza😜!';
                            }
                            this.showChangeMessage = true;


                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00
                                this.cartId = ''
                                this.paymentAmount = 0;
                                this.viewCart = 0;
                                localStorage['cartId'] = '';
                                this.createCart();
                            }, 3000);
                        }
                    })
            },

            pizzaImage(pizza) {
                return `Pizza Medium.png`
            }

        }
    });

});
