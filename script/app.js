$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('home', loadHomePage);
        this.get('index.html', loadHomePage);

        this.get('#/login', (ctx) => {

            ctx.loadPartials({
                navigation: '../templates/common/navigation.hbs',
                footer: '../templates/common/footer.hbs',
            }).then(function () {
                this.partial('../templates/forms/login.hbs');
            });

        });

        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;
         
            if (!/^[a-zA-Z]{3,}$/.test(username)) {
                notify.showError('Username should be at least 3 characters long and contain only english alphabet letters');
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError('Password should be at least 6 characters long and contain only english alphabet letters');
            } else {
                auth.login(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('Login successful.');
                        console.log('login success');
                        ctx.redirect('#/carlistings');
                    })
                    .catch(notify.handleError);
            }

        });

        this.get('#/register', (ctx) => {

            ctx.loadPartials({
                navigation: '../templates/common/navigation.hbs',
                footer: '../templates/common/footer.hbs',
            }).then(function () {
                this.partial('../templates/forms/register.hbs');
            });

        });

        this.post('#/register', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            console.log(username, password, repeatPass)

            if (!/^[a-zA-Z]{3,}$/.test(username)) {
                notify.showError('Username should be at least 3 characters long and contain only english alphabet letters');
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError('Password should be at least 6 characters long and contain only english alphabet letters');
            } else if (repeatPass !== password) {
                notify.showError('Passwords must match!');
            } else {
                auth.register(username, password)
                    .then((userData) => {
                        auth.saveSession(userData);
                        notify.showInfo('User registration successful!');
                        ctx.redirect('#/carlistings');
                    })
                    .catch(notify.handleError);
            }
        });

        this.get('#/create/listing', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                navigation: '../templates/common/navigation.hbs',
                footer: '../templates/common/footer.hbs',
            }).then(function () {
                this.partial('../templates/listings/createListing.hbs');
            });
        });

        this.get('#/logout', (ctx) => {
            auth.logout()
                .then(() => {
                    sessionStorage.clear();
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });

        this.post('#/create/listing', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            let seller = sessionStorage.getItem('username');
            let title = ctx.params.title;
            let description = ctx.params.description;
            let imageUrl = ctx.params.imageUrl;
            let brand = ctx.params.brand;
            let model = ctx.params.model;
            let fuel = ctx.params.fuelType;
            let year = ctx.params.year;
            let price = ctx.params.price;

            if (title === '') {
                notify.showError('Title is required!');
            } else if (title.length > 33) {
                notify.showError('Title is too long!');
            } else if (description.length > 450) {
                notify.showError('Description is too long!');
            } else if (description.length < 30) {
                notify.showError('Description is too short!');
            } else if (brand === '') {
                notify.showError('Brand is required!');
            } else if (brand.length > 11) {
                notify.showError('Brand is too long!');
            } else if (model === "") {
                notify.showError('Model is required!');
            } else if (model.length > 11) {
                notify.showError('Model is too long!');
            } else if (year.toString().length > 4) {
                notify.showError('Year is too long!');
            } else if (imageUrl === '') {
                notify.showError('imageUrl is required!');
            } else if (fuel === "") {
                notify.showError('FuelType is required!');
            } else if (fuel.length > 11) {
                notify.showError('FuelType is too long!');
            } else if (price > 1000000) {
                notify.showError('Price is too much!');
            } else if (price === "") {
                notify.showError('Price is required!');
            } else if (!imageUrl.startsWith('http')) {
                notify.showError('imageUrl must be a valid link!');
            } else {
                cars.createCarListing(seller, title, description, imageUrl, brand, model, fuel, year, price)
                    .then(() => {
                        notify.showInfo('Listing created.');
                        ctx.redirect('#/home');
                    })
                    .catch(notify.handleError);
            }
        });

        this.get('#/edit/car/:carId', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            let carId = ctx.params.carId;

            cars.getCarById(carId)
                .then((car) => {
                    ctx.isAuth = auth.isAuth();
                    ctx.username = sessionStorage.getItem('username');
                    ctx.car = car;

                    ctx.loadPartials({
                        navigation: './templates/common/navigation.hbs',
                        footer: './templates/common/footer.hbs',
                    }).then(function () {
                        this.partial('./templates/editCar/editCarPage.hbs');
                    });
                });
        });


        this.post('#/edit/car', (ctx) => {

            let carId = ctx.params.carId;
            let seller = sessionStorage.getItem('username');
            let title = ctx.params.title;
            let description = ctx.params.description;
            let imageUrl = ctx.params.imageUrl;
            let brand = ctx.params.brand;
            let model = ctx.params.model;
            let fuel = ctx.params.fuelType;
            let year = ctx.params.year;
            let price = ctx.params.price;


            if (title === '') {
                notify.showError('Title is required!');
            } else if (title.length > 33) {
                notify.showError('Title is too long!');
            } else if (description.length > 450) {
                notify.showError('Description is too long!');
            } else if (description.length < 30) {
                notify.showError('Description is too short!');
            } else if (brand === '') {
                notify.showError('Brand is required!');
            } else if (brand.length > 11) {
                notify.showError('Brand is too long!');
            } else if (model === "") {
                notify.showError('Model is required!');
            } else if (model.length > 11) {
                notify.showError('Model is too long!');
            } else if (year.toString().length > 4) {
                notify.showError('Year is too long!');
            } else if (imageUrl === '') {
                notify.showError('imageUrl is required!');
            } else if (fuel === "") {
                notify.showError('FuelType is required!');
            } else if (fuel.length > 11) {
                notify.showError('FuelType is too long!');
            } else if (price > 1000000) {
                notify.showError('Price is too long!');
            } else if (price === "") {
                notify.showError('Price is too long!');
            } else if (!imageUrl.startsWith('http')) {
                notify.showError('imageUrl must be a valid link!');
            } else {
                cars.editCarListing(carId, seller, title, description, imageUrl, brand, model, fuel, year, price)
                    .then(() => {
                        notify.showInfo(`Post ${title} updated.`);
                        ctx.redirect('#/home');
                    })
                    .catch(notify.showError);
            }
        });

        this.get('#/delete/car/:carId', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            let carId = ctx.params.carId;
            cars.deleteCarListing(carId)
                .then(() => {
                    notify.showInfo('Car deleted.');
                    ctx.redirect('#/home');
                })
                .catch(notify.handleError);
        });


        this.get('#/details/:carId', (ctx) => {
            let carId = ctx.params.carId;

            cars.getCarById(carId)
                .then((car) => {
                    car.isAuthor = car._acl.creator === sessionStorage.getItem('userId');
                    ctx.isAuth = auth.isAuth();

                    ctx.username = sessionStorage.getItem('username');
                    ctx.car = car;

                    ctx.loadPartials({
                        navigation: './templates/common/navigation.hbs',
                        footer: './templates/common/footer.hbs'
                    }).then(function () {
                        this.partial('./templates/listings/listingDetails.hbs');
                    })
                }).catch(notify.handleError);
        });


        this.get('#/mylistings', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            let username = sessionStorage.getItem('username');

            cars.getMyCars(username)
                .then((cars) => {
                    console.log(cars)
                    cars.forEach((c) => {
                        c.brand = c.brand;
                        c.description = c.description;
                        c.fuel = c.fuel;
                        c.imageUrl = c.imageUrl;
                        c.model = c.model;
                        c.price = c.price;
                        c.seller = c.seller;
                        c.title = c.title;
                        c.year = c.year;
                        c.isAuthor = c._acl.creator === sessionStorage.getItem('userId');

                    });

                    ctx.isAuth = auth.isAuth();

                    ctx.username = sessionStorage.getItem('username');
                    ctx.cars = cars;

                    ctx.loadPartials({
                        navigation: '../templates/common/navigation.hbs',
                        footer: '../templates/common/footer.hbs',
                        myListings: '../templates/listings/myListings.hbs'
                    }).then(function () {
                        this.partial('../templates/listings/myCarsList.hbs');
                    });
                });
        });

        this.get('#/carlistings', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            cars.getAllCars()
                .then((cars) => {
                    console.log(cars)
                    cars.forEach((c) => {
                        c.brand = c.brand;
                        c.description = c.description;
                        c.fuel = c.fuel;
                        c.imageUrl = c.imageUrl;
                        c.model = c.model;
                        c.price = c.price;
                        c.seller = c.seller;
                        c.title = c.title;
                        c.year = c.year;
                        c.isAuthor = c._acl.creator === sessionStorage.getItem('userId');

                    });
                    ctx.isAuth = auth.isAuth();

                    ctx.username = sessionStorage.getItem('username');
                    ctx.cars = cars;
                    ctx.carId = ctx.params.carId;


                    ctx.loadPartials({
                        navigation: '../templates/common/navigation.hbs',
                        footer: '../templates/common/footer.hbs',
                        carListing: '../templates/home/car-listing.hbs',
                        car: '../templates/home/car.hbs'
                    }).then(function () {
                        this.partial('../templates/home/car-listings.hbs');
                    });
                });
        }).catch(notify.handleError);

        function loadHomePage(ctx) {
            if (auth.isAuth()) {
                ctx.redirect('#/carlistings');
                return;
            }

            ctx.loadPartials({
                navigation: '../templates/common/navigation.hbs',
                footer: '../templates/common/footer.hbs',
            }).then(function () {
                this.partial('../templates/home/home.hbs');
            });
        }
    });
    app.run();
});