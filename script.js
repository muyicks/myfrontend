
var app = new Vue({
    el: '#app',
    data: {
        showProduct: true,
        lessons: [],
        cart: [],
        searchTerm: '',
        username: '',
        phone: '',
        sortAttribute: '',
        sortOrder: 'asc',
        baseURL: "https://afterskoolbackend.vercel.app/"
    },

    created() {
this.getLessons()
    },

    methods: {
        async getLessons() {
            var res = await fetch(`${this.baseURL}collection/lessons`);
            this.lessons = await res.json();
          },
      
          async searchLessons() {
            var query = {
              search: this.searchTerm,
              sort: this.sortAttribute,
              order: this.sortOrder,
            };
      
            var res = await fetch(`${this.baseURL}search/collection/lessons`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(query),
            });
            this.lessons = await res.json();
          },
      
          async submitOrder() {
            var order = {
              cart: [...this.cart],
              username: this.username,
              phone: this.phone,
            };
      
            // Update lessons
            this.cart.forEach((item) => {
              fetch(`${this.baseURL}collection/lessons/${item.lesson._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spaces: item.lesson.spaces }),
              });
            });
      
            // Save Order
            await fetch(`${this.baseURL}collection/orders`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(order),
            });
            alert("Order Submitted");
            this.cart = []
            this.showProduct = true
          },

        addToCart(lesson) {
            if (lesson.spaces > 0) {
                lesson.spaces--;
                var cartIndex = this.cart.findIndex(i => i.lesson === lesson);
                if (cartIndex > -1) {
                    this.cart[cartIndex].amount++;
                } else {
                    this.cart.push({
                        lesson: lesson,
                        amount: 1
                    });
                }
            }
        },
        removeProduct(lesson) {
            const index = this.cart.findIndex(i => i.lesson === lesson);
            if (index !== -1) {
                this.cart[index].amount--;
                lesson.spaces += 1;
                if (this.cart[index].amount == 0) {
                    this.cart.splice(index, 1);
                }
            }
        },
        checkItemCount(id) {
            let itemCount = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].lesson.id === id) {
                    itemCount += 1;
                }
            }
            return itemCount;
        },
        showCheckOut() {
            this.showProduct = this.showProduct ? false : true;
        },
      

        removeFromCart (item) {
            item.lesson.Spaces += item.amount;
            const lessonIndex = this.cart.findIndex(cartItem => cartItem.lesson === item.lesson);
            if (lessonIndex !== -1) {
                this.cart.splice(lessonIndex, 1);
            }
        },
    },
    
    computed: {
        
        cartSize: function () {
            return this.cart.reduce((sum, lesson) => sum + lesson.amount, 0);
        },
        canAddToCart(lessons) {
            return this.lessons.spaces > this.checkItemCount(lessons.id);
        },
        validateUserInfo() {
            return /^[a-zA-Z]+$/.test(this.username) && /^\d+$/.test(this.phone);
        }
    },
  });