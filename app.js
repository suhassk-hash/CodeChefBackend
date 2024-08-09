import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios'; // Import axios

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Ensure to provide the options

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/templates/index.html'));
});

app.post('/', (req, res) => {
    const searchElement = encodeURIComponent(req.body.search_element);
    res.redirect(`/${searchElement}`);
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const API_KEY = '45301861-f273265c333323f594870007c';
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(id)}`;
    let image = '';
    try {
        const response = await axios.get(URL);
        const data = response.data;
        if (data.totalHits > 0) {
            image += '<div class="results">';
            data.hits.forEach(hit => {
                image += `<img src="${hit.largeImageURL}" alt="Image" width="500" height="300">`;
            });
            image += '</div>';
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Image Search Results</title>
                    <link rel="stylesheet" href="/styles/style.css">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                </head>
                <body>
                    <div class="container">
                        ${image}
                    </div>
                </body>
                </html>
            `);
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>No Results</title>
                    <link rel="stylesheet" href="/styles/style.css">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
                </head>
                <body>
                    <div class="container">
                        <div class="no-results">No images found</div>
                    </div>
                </body>
                </html>
            `);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
