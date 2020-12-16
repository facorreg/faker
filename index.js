const faker = require('faker');
const fetch = require('node-fetch');
const cliProgress = require('cli-progress');
const _colors = require('colors');

const types = [
    'food',
    'sports',
    'fashion',
    'animals',
    'business',
    'cats',
    'city',
    'nightlife',
    'people',
    'nature',
    'technics',
    'transport',
];

const companyNames = [
    'Megazord',
    'Platypus factories',
    'Aggressive otter',
    'Raw meat',
    'Capt\'n Hammer'
]

const GENERATE_NB = 1900;

const makeBarFormat = (message, color) => ({
    format: `${message}: ${_colors[color]('[{bar}]')}  ETA: {eta}s | {value}/{total} | {percentage}%`,
    clearOnComplete: true,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

const creationBar = new cliProgress.SingleBar(makeBarFormat('Generating Data', 'magenta'));
const sendBar = new cliProgress.SingleBar(makeBarFormat('Sending Data', 'green'))
const fetchBar = new cliProgress.SingleBar(makeBarFormat('Data created', 'cyan'))

creationBar.start(GENERATE_NB, 0);
sendBar.start(GENERATE_NB, 0);
fetchBar.start(GENERATE_NB, 0);

const getRandomElementFromArray = (array) => array[Math.floor(Math.random() * Math.floor(array.length - 1))];
const rand = (n) => Math.floor(Math.random() * Math.floor(n))
const generateProduct = () => {
    const productType = getRandomElementFromArray(types);
    const itype = types[rand(types.length)];
    const image = faker.image[itype]();

    return {
        id: faker.random.uuid(),
        name: faker.lorem.words(),
        price: faker.commerce.price() / 100,
        description: faker.lorem.paragraph(),
        ref: getRandomElementFromArray(companyNames),
        promotions: rand(2) ? Math.floor(Math.random() * Math.floor(15)) * 5 : 0,
        images: {
            thumbnail: image,
            large: image,
            medium: image,
            small: image,
            original: image,
        },
        type: productType,
    };
};

const generateProducts = (nb) => Array.from(Array(nb), () => {
    creationBar.increment();
    return generateProduct();
});

const createdPromises = generateProducts(GENERATE_NB)
    .map(product => {
        sendBar.increment();
        return fetch('http://localhost:1337/products', { method: 'POST', body: JSON.stringify(product) })
            .then((data) => {
                fetchBar.increment();
                return data;
            });
    });

Promise.all(createdPromises).finally(() => {
    creationBar.stop();
    sendBar.stop();
    fetchBar.stop();
})


// fetch('http://localhost:1337/products')
//     .then(res => res.json())
//     .then(e => e.forEach(({ id }) => { return fetch(`http://localhost:1337/products/${id}`, { method: 'DELETE' }) }))

