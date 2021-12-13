const API_URL = 'https://api.themoviedb.org/3'
const Review = require('../../models/Review');

module.exports = (app) => {
    import('node-fetch').then(module => {
        const fetch = module.default;

        const getMovieInfor = (req, res) => {
            const name = req.params['movieName']
            const language = req.params['language']
            const ratingFilter = req.params['rating']


            let movieNameSearch = ''
            let rating = 0
            let languageSearch = ''


            if (name !== 'NA') {
                movieNameSearch = `&query=${name}`
            }

            if (language === 'English') {
                languageSearch = `&language=en`
            } else if (language === 'German') {
                languageSearch = `&language=de`
            } else if (language === 'Japanese') {
                languageSearch = `&language=ja`
            } else if (language === 'French') {
                languageSearch = `&language=fr`
            } else if (language === 'Spanish') {
                languageSearch = `&language=es`
            } else if (language === 'Korean') {
                languageSearch = `&language=ko`
            }

            console.log(languageSearch)
            if (ratingFilter === '>= 1.0') {
                rating = 1
            } else if (ratingFilter === '>= 2.0') {
                rating = 2
            } else if (ratingFilter === '>= 3.0') {
                rating = 3
            } else if (ratingFilter === '>= 4.0') {
                rating = 4
            } else if (ratingFilter === '>= 5.0') {
                rating = 5
            } else {
                rating = 0
            }

            let movieURL = `${API_URL}/search/movie?api_key=6ecbcc32f1691bbd0ef5826095745798${movieNameSearch}${languageSearch}`
            if (name === 'NA'){
                movieURL = 'https://api.themoviedb.org/3/movie/upcoming?api_key=6ecbcc32f1691bbd0ef5826095745798&language=en-US&page=1'
            }
            fetch(movieURL)
                .then(response => response.json())
                .then(list => {
                    const ids = list.results.map(movie => movie.id);
                    Review.aggregate([
                        { $match: { 'originalId': { $in: ids } } },
                        {
                            $group:
                                {
                                    _id: "$originalId",
                                    averageRating: { $avg: "$rating" }
                                }
                        }
                    ]).then(movieRatings => {
                        const mapOriginalIdToRating = new Map();
                        for (const movieRating of movieRatings) {
                            mapOriginalIdToRating.set(movieRating._id, movieRating.averageRating);
                        }
                        res.json(list.results.map(originalMovie => {
                            if (!mapOriginalIdToRating.has(originalMovie.id)) {
                                originalMovie.rating = 0
                            } else {
                                originalMovie.rating = mapOriginalIdToRating.get(originalMovie.id);
                            }
                            return originalMovie;
                        }).filter(movie => movie.rating >= rating && movie.poster_path !== null));

                    });
                })
        };

        app.get('/search/:movieName/:language/:rating', getMovieInfor);
    })
};