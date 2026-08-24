const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('お帰りなさい、ご飯にする、おふろにする、それとも…わ　た　し？');
});

app.get('/aboutHikari', (req, res) => {
    res.json({
        id: 0,
        name: "Hikari"
    });
});



const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
