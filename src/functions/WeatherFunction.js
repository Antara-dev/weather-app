const { app } = require('@azure/functions');

app.http('WeatherFunction', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        
        const city = request.query.get('city');
        
        if (!city) {
            return { 
                status: 400,
                body: 'Please provide a city name. Example: ?city=Mumbai' 
            };
        }

        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            return { 
                status: 404,
                body: `City "${city}" not found.` 
            };
        }

        const weather = {
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            condition: data.weather[0].description
        };

        return { 
            status: 200,
            jsonBody: weather
        };
    }
});