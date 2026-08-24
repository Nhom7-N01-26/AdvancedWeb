const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('お帰りなさい、ご飯にする、おふろにする、それとも…わ...た...し？');
});

app.get('/aboutHikari', (req, res) => {
    res.json({
        id: 0,
        name: "Hikari"
    });
});

app.post('/aboutHikari', (req, res) => {
    const { id, name } = req.body;
    res.json({
        id,
        name
    });
});

app.post('/', (req, res) => {
    res.json('お帰りなさい、ご飯にする、おふろにする、それとも…わ...た...し？');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
